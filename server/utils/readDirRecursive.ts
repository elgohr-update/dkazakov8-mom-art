import fs from 'fs';
import path from 'path';

export function readDirRecursive(dir) {
  return Promise.resolve()
    .then(() => fs.promises.readdir(dir, { withFileTypes: true }))
    .then(filesDescriptions =>
      Promise.all(
        filesDescriptions.map(desc => {
          const filePath = path.resolve(dir, desc.name);

          return desc.isDirectory() ? readDirRecursive(filePath) : filePath;
        })
      )
    )
    .then(files => files.flat());
}
