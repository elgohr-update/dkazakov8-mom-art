import S3 from 'aws-sdk/clients/s3';

import { createError } from 'utils';
import { errorsNames } from 'const';

import { env } from '../../env';

export const s3Options = {
  credentials: {
    accessKeyId: env.CDN_ACCESS_KEY_ID,
    secretAccessKey: env.CDN_SECRET_ACCESS_KEY,
  },
  region: 'ru-central1',
  endpoint: env.CDN_ENDPOINT,
  httpOptions: {
    connectTimeout: 1000 * 60,
  },
};

export const s3 = new S3(s3Options);

function logMessage(...consoleArgs: any[]) {
  return function promiseHandler(arg: any) {
    if (env.LOGS_CDN) console.log(...consoleArgs);

    return arg;
  };
}

export function createCDNBucket({ Bucket }: { Bucket: string }) {
  return Promise.resolve()
    .then(logMessage(`Try to create bucket:${Bucket}`))
    .then(() => s3.headBucket({ Bucket }).promise())
    .then(logMessage(`Bucket:${Bucket} already exists`))
    .catch(err => {
      // bucket does not exist, create one
      if (err.statusCode >= 400 && err.statusCode < 500) {
        return Promise.resolve()
          .then(() => s3.createBucket({ Bucket, ACL: 'public-read' }).promise())
          .then(() => s3.headBucket({ Bucket }).promise())
          .then(() =>
            s3
              .putBucketCors({
                Bucket,
                CORSConfiguration: {
                  CORSRules: [
                    {
                      AllowedHeaders: ['*'],
                      AllowedMethods: ['GET'],
                      AllowedOrigins: ['*'],
                    },
                  ],
                },
              })
              .promise()
          )
          .then(logMessage(`Bucket:${Bucket} created`));
      }

      throw err;
    });
}

export function uploadToCDNBucket({
  Bucket,
  Expires,
  fileName,
  fileContent,
  ContentType,
  ContentEncoding,
}: {
  Bucket: string;
  Expires?: any;
  fileName: string;
  fileContent: any;
  ContentType: string;
  ContentEncoding?: string;
}) {
  const reqData = {
    ACL: 'public-read',
    Key: fileName,
    Body: fileContent,
    Bucket,
    Expires,
    ContentType,
    ContentEncoding,
  };

  return s3.putObject(reqData).promise();
}

export function removeFromCDNBucket({ Bucket, fileName }: { Bucket: string; fileName: string }) {
  return Promise.resolve()
    .then(logMessage(`Try to remove file ${fileName} from bucket:${Bucket}`))
    .then(() => s3.headObject({ Bucket, Key: fileName }).promise())
    .then(() =>
      s3
        .deleteObject({
          Bucket,
          Key: fileName,
        })
        .promise()
    )
    .then(logMessage(`File ${fileName} removed from bucket:${Bucket}`))
    .catch(error => {
      if (error.code === 'NotFound') {
        throw createError(errorsNames.NOT_FOUND, `File with name ${fileName} not found in bucket`);
      }

      throw error;
    });
}
