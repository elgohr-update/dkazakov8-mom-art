import { db } from 'db';

export function getImagesController() {
  return Promise.resolve()
    .then(db.getImages)
    .then(imagesArray => ({ images: imagesArray }));
}
