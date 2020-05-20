import { env } from '../../env';

import { createCDNBucket, copyToAnotherCDNBucket } from './s3';

export function copyAssetsToProdBucket() {
  if (!env.YANDEX_STORAGE_COPY_TO_PROD) return Promise.resolve();

  return Promise.resolve()
    .then(() =>
      createCDNBucket({
        bucketName: `${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.YANDEX_STORAGE_BUCKET}`,
      })
    )
    .then(() =>
      copyToAnotherCDNBucket({
        fromBucket: `${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.GIT_COMMIT}`,
        toBucket: `${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.YANDEX_STORAGE_BUCKET}`,
      })
    );
}
