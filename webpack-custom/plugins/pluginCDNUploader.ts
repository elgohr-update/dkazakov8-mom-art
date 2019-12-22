/**
 * @docs: https://github.com/matrus2/webpack-s3-uploader
 *
 */

import CDNUploader from 'webpack-s3-uploader';

import { env } from '../../env';
import { cdnBucketName } from '../utils/cdnBucketName';

export const pluginCDNUploader = new CDNUploader({
  s3Options: {
    accessKeyId: env.getParam('YANDEX_STORAGE_ACCESS_KEY_ID'),
    secretAccessKey: env.getParam('YANDEX_STORAGE_SECRET_ACCESS_KEY'),
    region: 'ru-central1',
    endpoint: 'https://storage.yandexcloud.net',
  },
  s3UploadOptions: {
    Bucket: cdnBucketName,

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
