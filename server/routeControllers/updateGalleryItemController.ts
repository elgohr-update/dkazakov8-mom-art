import { isLoggedIn } from 'serverUtils';
import { moveElementInArray } from 'utils';

import { db } from '../db';

export function updateGalleryItemController({ req }) {
  return Promise.resolve()
    .then(() => isLoggedIn({ req }))
    .then(db.getImages)
    .then(imagesArray => {
      const { order, id } = req.body;

      const updatedGalleryItemIndex = imagesArray.findIndex(galleryItem => galleryItem.id === id);

      const galleryItemsReordered = moveElementInArray({
        source: imagesArray,
        from: updatedGalleryItemIndex,
        to: order,
      });

      ['ru', 'en'].forEach(language => {
        const newTitle = req.body[`title_${language}`];

        if (newTitle != null) {
          galleryItemsReordered[order].title[language] = newTitle;
        }
      });

      return db.setImages(galleryItemsReordered).then(() => ({ images: galleryItemsReordered }));
    });
}
