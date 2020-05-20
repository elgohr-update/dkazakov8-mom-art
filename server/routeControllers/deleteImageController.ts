import { db } from 'db';
import { isLoggedIn, removeFromBucket } from 'serverUtils';

import { env } from '../../env';

export function deleteImageController({ req }) {
  return Promise.resolve()
    .then(() => isLoggedIn({ req }))
    .then(db.getImages)
    .then(imagesArray => {
      const modifiedDataArray = imagesArray.filter(({ id }) => id !== req.body.id);
      const removedImageData = imagesArray.find(({ id }) => id === req.body.id);

      let removedFiles = Object.keys(removedImageData.sources).map(
        suffix => removedImageData.sources[suffix].src
      );
      removedFiles = removedFiles.map(src =>
        src.replace(
          `${env.YANDEX_STORAGE_ENDPOINT}/${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.YANDEX_STORAGE_BUCKET}/`,
          ''
        )
      );

      return Promise.resolve()
        .then(() =>
          Promise.all(
            removedFiles.map(fileName =>
              removeFromBucket({
                Bucket: `${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.YANDEX_STORAGE_BUCKET}`,
                fileName,
              })
            )
          )
        )
        .then(() => db.setImages(modifiedDataArray))
        .then(() => ({ images: modifiedDataArray }));
    });
}
