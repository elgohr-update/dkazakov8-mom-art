import S3 from 'aws-sdk/clients/s3';

import { errorsNames } from 'const/errorsNames';
import { createError } from 'utils/createError';

import { env } from '../../env';

export const s3Options = {
  credentials: {
    accessKeyId: env.YANDEX_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.YANDEX_STORAGE_SECRET_ACCESS_KEY,
  },
  region: 'ru-central1',
  endpoint: env.YANDEX_STORAGE_ENDPOINT,
  httpOptions: {
    connectTimeout: 1000 * 60,
  },
};

export const s3 = new S3(s3Options);

export function logMessage(...args: any[]) {
  if (!env.LOGS_YANDEX_STORAGE) return;

  console.log(...args);
}

export function createCDNBucket({ bucketName }: { bucketName: string }) {
  logMessage(`Try to create bucket:${bucketName}`);

  return Promise.resolve()
    .then(() => s3.headBucket({ Bucket: bucketName }).promise())
    .then(() => logMessage(`Bucket:${bucketName} already exists`))
    .catch(err => {
      // bucket does not exist, create one
      if (err.statusCode >= 400 && err.statusCode < 500) {
        return Promise.resolve()
          .then(() => s3.createBucket({ Bucket: bucketName, ACL: 'public-read' }).promise())
          .then(() => logMessage(`Bucket:${bucketName} created`));
      }

      throw err;
    });
}

export function copyToAnotherCDNBucket({
  fromBucket,
  toBucket,
}: {
  fromBucket: string;
  toBucket: string;
}) {
  logMessage(`Try to copy bucket:${fromBucket} to bucket:${toBucket}`);

  return Promise.resolve()
    .then(() => s3.listObjectsV2({ Bucket: fromBucket }).promise())
    .then(({ Contents }) =>
      Promise.all(
        Contents.map(({ Key }) =>
          s3
            .copyObject({
              ACL: 'public-read',
              Bucket: toBucket,
              CopySource: `/${fromBucket}/${Key}`,
              Key,
            })
            .promise()
        )
      ).then(() => {
        logMessage(
          `Bucket:${fromBucket} was copied to bucket:${toBucket}\n`,
          Contents.map(({ Key }) => Key)
        );
      })
    );
}

export function uploadToBucket({
  Bucket,
  fileName,
  fileContent,
  ContentType,
  ContentEncoding,
}: {
  Bucket: string;
  fileName: string;
  ContentType: string;
  fileContent: any;
  ContentEncoding?: string;
}) {
  logMessage(`Try to upload file ${fileName} to bucket:${Bucket}`);

  return Promise.resolve()
    .then(() =>
      s3
        .putObject({
          ACL: 'public-read',
          Bucket,
          Key: fileName,
          Body: fileContent,
          ContentType,
          ContentEncoding,
        })
        .promise()
    )
    .then(() => logMessage(`File ${fileName} uploaded to bucket:${Bucket}`));
}

export function removeFromBucket({ Bucket, fileName }: { Bucket: string; fileName: string }) {
  logMessage(`Try to remove file ${fileName} from bucket:${Bucket}`);

  return Promise.resolve()
    .then(() => s3.headObject({ Bucket, Key: fileName }).promise())
    .then(() =>
      s3
        .deleteObject({
          Bucket,
          Key: fileName,
        })
        .promise()
    )
    .then(() => logMessage(`File ${fileName} removed from bucket:${Bucket}`))
    .catch(error => {
      if (error.code === 'NotFound') {
        throw createError(errorsNames.NOT_FOUND, `File with name ${fileName} not found in bucket`);
      }

      throw error;
    });
}
