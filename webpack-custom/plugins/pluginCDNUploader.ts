/**
 * @docs: https://github.com/matrus2/webpack-s3-uploader
 * (reduced version)
 *
 */

import _ from 'lodash';
import s3 from 's3-client';
import webpack from 'webpack';

import { env } from '../../env';
import { s3Options as currentS3Options, logMessage } from '../../server/serverUtils/s3';

const testRule = (rule, subject) => {
  if (_.isRegExp(rule)) {
    return rule.test(subject);
  } else if (_.isFunction(rule)) {
    return Boolean(rule(subject));
  } else if (_.isArray(rule)) {
    return _.every(rule, condition => testRule(condition, subject));
  } else if (_.isString(rule)) {
    return new RegExp(rule).test(subject);
  }
  throw new Error('Invalid include / exclude rule');
};

const handleErrors = (error, compilation, cb) => {
  compilation.errors.push(new Error(error));
  cb(new Error(error));
};

const getAssetFiles = ({ assets }) => {
  const files = _.map(assets, (value, name) => ({
    name,
    path: value.existsAt,
  }));

  return Promise.resolve(files);
};

type Options = {
  include?: RegExp;
  exclude?: RegExp;
  s3Options: typeof currentS3Options;
  s3UploadOptions: {
    Bucket: string;
    ContentType: (fileName: string, file?: any) => string | undefined;
    ContentEncoding: (fileName: string, file?: any) => string | undefined;
  };
};

class S3Plugin {
  options: {
    include?: RegExp;
    exclude?: RegExp;
    directory?: string;
  };
  clientConfig: {
    s3Options: typeof currentS3Options;
  };
  isConnected: boolean;
  uploadOptions: Options['s3UploadOptions'];
  client: typeof s3;

  constructor(options: Options) {
    const { include, exclude, s3Options, s3UploadOptions } = options;

    this.uploadOptions = s3UploadOptions;
    this.isConnected = false;

    this.options = {
      include,
      exclude,
    };

    this.clientConfig = {
      s3Options,
    };
  }

  apply(compiler) {
    this.connect();

    this.options.directory = compiler.options.output.path || compiler.options.output.context || '.';

    compiler.plugin('after-emit', (compilation, cb) => {
      getAssetFiles(compilation)
        .then(files => this.filterAllowedFiles(files))
        .then(files =>
          Promise.all(files.map(file => this.uploadFile(file.name, file.path))).then(() =>
            logMessage(
              `Files uploaded to bucket:${this.uploadOptions.Bucket}\n`,
              files.map(file => file.name)
            )
          )
        )
        .then(() => cb())
        .catch(e => handleErrors(e, compilation, cb));
    });
  }

  filterAllowedFiles(files) {
    const output = files.reduce((res, file) => {
      if (this.isIncludeAndNotExclude(file.name)) {
        res.push(file);
      }

      return res;
    }, []);
    return Promise.resolve(output);
  }

  isIncludeAndNotExclude(file) {
    const { include, exclude } = this.options;

    const isExclude = exclude ? testRule(exclude, file) : false;
    const isInclude = include ? testRule(include, file) : true;

    return isInclude && !isExclude;
  }

  connect() {
    if (this.isConnected) return;

    this.client = s3.createClient(this.clientConfig);
    this.isConnected = true;
  }

  uploadFile(fileName, file) {
    /*
     * assets not output to the webpack config output dir will have relative file name format, and ../ will crash the uploader
     * so we need to scrub them out
     *
     * example: output dir:                  dist/bundle
     *          file-loader produced output: dist/assets/someimage.png
     *          fileName:                    ../assets/someimage.png
     */
    // eslint-disable-next-line no-param-reassign
    fileName = fileName.split('../').join('');

    let Key = fileName;
    const s3Params = _.mapValues(this.uploadOptions, (
      optionConfig // eslint-disable-line no-confusing-arrow
    ) => (_.isFunction(optionConfig) ? optionConfig(fileName, file) : optionConfig));

    // avoid noname folders in bucket
    if (Key[0] === '/') Key = Key.substr(1);

    const upload = this.client.uploadFile({
      localFile: file,
      s3Params: _.merge({ Key }, s3Params),
    });

    return new Promise((resolve, reject) => {
      upload.on('error', err =>
        reject(new Error(`failed uplaoding file: ${file} with Key ${Key} err: ${err}`))
      ); // eslint-disable-line prefer-promise-reject-errors
      upload.on('end', () => resolve(file));
    });
  }
}

export const pluginCDNUploader: webpack.Plugin = new S3Plugin({
  s3Options: currentS3Options,
  s3UploadOptions: {
    Bucket: `${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.GIT_COMMIT}`,

    ContentEncoding(fileName) {
      if (/\.gz/.test(fileName)) return 'gzip';
      if (/\.br/.test(fileName)) return 'br';
    },

    ContentType(fileName) {
      if (/\.css/.test(fileName)) return 'text/css';
      if (/\.js/.test(fileName)) return 'text/javascript';
    },
  },
});
