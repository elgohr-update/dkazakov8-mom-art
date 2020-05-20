import fs from 'fs';
import path from 'path';

import sharp from 'sharp';
import multer from 'multer';

import { isLoggedIn, uploadToBucket } from 'serverUtils';
import { db } from 'db';
import { TypeGalleryItem } from 'models/GalleryItems';

import { env } from '../../env';
import { paths } from '../../paths';

const uploadsFolderName = 'uploads';
const uploadsPath = path.resolve(paths.rootPath, uploadsFolderName);
const uploader = multer({
  dest: uploadsPath,
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

const filesConfig = [
  {
    targetWidth: 400,
    targetHeight: null,
    fileSuffix: 'small',
    jpegParams: {
      quality: 80,
      progressive: true,
    },
  },
  {
    targetWidth: null,
    targetHeight: 1000,
    fileSuffix: 'big',
    jpegParams: {
      quality: 90,
    },
  },
];

export function uploadImageController({ req, res }) {
  return Promise.resolve()
    .then(() => isLoggedIn({ req }))
    .then(() => uploadFile({ req, res }))
    .then(() => {
      const { path: tempFilePath, filename: tempFileName, mimetype } = req.file;

      const uploadedFileData: TypeGalleryItem = {
        id: tempFileName,
        title: {
          ru: req.body.title_ru,
          en: req.body.title_en,
        },
        sources: {
          big: {
            src: '',
            width: 0,
            height: 0,
          },
          small: {
            src: '',
            width: 0,
            height: 0,
          },
        },
      };

      return Promise.all(
        filesConfig.map(({ targetWidth, targetHeight, fileSuffix, jpegParams }) => {
          const fileName = `${tempFileName}-${fileSuffix}.jpeg`;
          const filePath = `${tempFilePath}-${fileSuffix}.jpeg`;

          return sharp(tempFilePath)
            .resize(targetWidth, targetHeight)
            .jpeg(jpegParams)
            .toFile(filePath)
            .then(info => {
              uploadedFileData.sources[fileSuffix] = {
                src: `${env.YANDEX_STORAGE_ENDPOINT}/${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.YANDEX_STORAGE_BUCKET}/${uploadsFolderName}/${fileName}`,
                width: info.width,
                height: info.height,
              };
            })
            .then(() => fs.promises.readFile(filePath))
            .then(fileContent =>
              uploadToBucket({
                Bucket: `${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.YANDEX_STORAGE_BUCKET}`,
                fileName: `${uploadsFolderName}/${fileName}`,
                fileContent,
                ContentType: mimetype,
              })
            )
            .then(() => fs.promises.unlink(filePath));
        })
      )
        .then(() => fs.promises.unlink(tempFilePath))
        .then(db.getImages)
        .then(imagesArray => {
          imagesArray.push(uploadedFileData);

          return db.setImages(imagesArray).then(() => ({ images: imagesArray }));
        });
    });
}
