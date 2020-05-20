import { db } from 'db';

import { env } from '../../env';

export function getImagesController() {
  return Promise.resolve()
    .then(db.getImages)
    .then(imagesArray => {
      if (
        imagesArray[0] &&
        imagesArray[0].sources.small.src.indexOf(env.YANDEX_STORAGE_ENDPOINT) === -1
      ) {
        const imagesArrayLinkedToCDN = imagesArray.map(imageData => {
          const newImageData = imageData;

          Object.entries(imageData.sources).forEach(([suffix, sourceData]) => {
            newImageData.sources[
              suffix
            ].src = `${env.YANDEX_STORAGE_ENDPOINT}/${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.YANDEX_STORAGE_BUCKET}/uploads${sourceData.src}`;
          });

          return newImageData;
        });

        return db.setImages(imagesArrayLinkedToCDN);
      }
    })
    .then(db.getImages)
    .then(imagesArray => {
      return { images: imagesArray };
    });
}
