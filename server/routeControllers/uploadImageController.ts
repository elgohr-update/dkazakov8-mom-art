import path from 'path';

import sharp from 'sharp';
import multer from 'multer';

import { removeFile, isLoggedIn } from 'serverUtils';
import { db } from 'db';

const uploadPath = path.resolve(__dirname, '../../uploads');
const uploader = multer({
  dest: uploadPath,
  limits: {
    // in bytes
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== 'image/jpeg') {
      return callback(new Error('Only JPEG files allowed'));
    }

    return callback(null, true);
  },
}).single('file');

function uploadFile({ req, res }) {
  return new Promise((resolve, reject) => {
    uploader(req, res, err => (err ? reject(err) : resolve()));
  });
}

export function uploadImageController({ req, res }) {
  return Promise.resolve()
    .then(() => isLoggedIn({ req }))
    .then(() => uploadFile({ req, res }))
    .then(() => {
      const tempFilePath = req.file.path;
      const tempFilename = req.file.filename;
      const uploadedFileData = {
        id: tempFilename,
        title: {
          ru: req.body.title_ru,
          en: req.body.title_en,
        },
        sources: {
          big: {},
          small: {},
        },
      };

      return Promise.all([
        sharp(tempFilePath)
          .resize(400)
          .jpeg({
            quality: 80,
            progressive: true,
          })
          .toFile(`${tempFilePath}-small.jpeg`)
          .then(info => {
            uploadedFileData.sources.small = {
              src: `/${tempFilename}-small.jpeg`,
              width: info.width,
              height: info.height,
            };
          }),
        sharp(tempFilePath)
          .resize(null, 1000)
          .toFile(`${tempFilePath}-big.jpeg`)
          .then(info => {
            uploadedFileData.sources.big = {
              src: `/${tempFilename}-big.jpeg`,
              width: info.width,
              height: info.height,
            };
          }),
      ])
        .then(() => removeFile(tempFilePath))
        .then(db.getImages)
        .then(imagesArray => {
          imagesArray.push(uploadedFileData);

          return db.setImages(imagesArray).then(() => ({ images: imagesArray }));
        });
    });
}
