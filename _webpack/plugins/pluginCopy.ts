/**
 * @docs: https://webpack.js.org/plugins/copy-webpack-plugin
 *
 */

import path from 'path';

import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';

import { paths } from '../../paths';

export const pluginCopy: webpack.WebpackPluginInstance = new CopyPlugin({
  patterns: [
    {
      from: path.resolve(paths.templates, 'loaderio-c4b9047acdff0b82b9417f989b45a857.txt'),
      to: path.resolve(paths.build, 'loaderio-c4b9047acdff0b82b9417f989b45a857.txt'),
    },
  ],
});
