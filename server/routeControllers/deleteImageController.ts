import path from 'path';

import { db } from 'db';
import { removeFile, isLoggedIn } from 'serverUtils';

export function deleteImageController({ req }) {
  return Promise.resolve()
    .then(() => isLoggedIn({ req }))
    .then(db.getImages)
    .then(imagesArray => {
      const modifiedDataArray = imagesArray.filter(({ id }) => id !== req.body.id);
      const removedImageData = imagesArray.find(({ id }) => id === req.body.id);
      const removedPaths = Object.keys(removedImageData.sources).map(sourceName =>
        path.resolve(__dirname, `../../uploads${removedImageData.sources[sourceName].src}`)
      );

      return db
        .setImages(modifiedDataArray)
        .then(() => Promise.all(removedPaths.map(filePath => removeFile(filePath))))
        .then(() => ({ images: modifiedDataArray }));
    });
}
