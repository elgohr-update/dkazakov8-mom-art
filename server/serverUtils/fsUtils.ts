import fs from 'fs';
import path from 'path';
import util from 'util';

export const removeFile = util.promisify(fs.unlink);

export function deleteRecursiveSync(src) {
  if (!fs.existsSync(src)) {
    return false;
  }

  fs.readdirSync(src).forEach(fileName => {
    const filePath = path.join(src, fileName);

    if (fs.statSync(filePath).isDirectory()) {
      return deleteRecursiveSync(filePath);
    }

    fs.unlinkSync(filePath);
  });

  fs.rmdirSync(src);
}
