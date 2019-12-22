/**
 * @docs: https://webpack.js.org/plugins/copy-webpack-plugin
 *
 */

import path from 'path';

import CopyPlugin from 'copy-webpack-plugin';

import { paths } from '../utils/paths';

export const pluginCopy = new CopyPlugin([
  {
    from: path.resolve(paths.templatesPath, 'loaderio-c4b9047acdff0b82b9417f989b45a857.txt'),
    to: path.resolve(paths.buildPath, 'loaderio-c4b9047acdff0b82b9417f989b45a857.txt'),
  },
]);
