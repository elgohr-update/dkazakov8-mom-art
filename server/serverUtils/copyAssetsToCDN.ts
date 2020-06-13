import fs from 'fs';
import path from 'path';

import mime from 'mime-types';

import { readDirRecursive } from 'serverUtils';

import { env } from '../../env';
import { paths } from '../../paths';
import { configEntryServer } from '../../_webpack/configs/configEntryServer';

import { createCDNBucket, uploadToCDNBucket } from './s3';

const Bucket = `${env.CDN_BUCKET_PREFIX}${env.CDN_BUCKET}`;

function uploadBuildFile(filePath) {
  const fileRelativeName = filePath
    .replace(`${paths.buildPath}${path.sep}`, '')
    .replace(/\\/g, '/');

  let ContentEncoding;
  if (/\.br/.test(filePath)) ContentEncoding = 'br';
  if (/\.gz/.test(filePath)) ContentEncoding = 'gzip';

  let ContentType = mime.lookup(fileRelativeName) || 'application/octet-stream';
  if (/\.css/.test(filePath)) ContentType = 'text/css';
  if (/\.js/.test(filePath)) ContentType = 'application/javascript';

  const Expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 1 month

  return Promise.resolve()
    .then(() => fs.promises.readFile(filePath))
    .then(fileContent =>
      uploadToCDNBucket({
        Bucket,
        Expires,
        fileName: fileRelativeName,
        fileContent,
        ContentType,
        ContentEncoding,
      })
    );
}

export function copyAssetsToCDN() {
  if (!env.CDN_ENABLED) return Promise.resolve();

  const startTime = Date.now();

  const excludedFilenames = Object.keys(configEntryServer).map(fileName => `${fileName}.js`);

  return Promise.resolve()
    .then(() => createCDNBucket({ Bucket }))
    .then(() => readDirRecursive(paths.buildPath))
    .then(buildFilesPaths =>
      buildFilesPaths.filter(
        filePath => !excludedFilenames.some(fileName => filePath.includes(fileName))
      )
    )
    .then(buildFilesPaths => Promise.all(buildFilesPaths.map(uploadBuildFile)))
    .then(() => {
      if (env.LOGS_CDN) {
        const endTime = Date.now();

        console.log(
          `Files from build folder have been uploaded to CDN within ${
            (endTime - startTime) / 1000
          } seconds`
        );
      }
    });
}
