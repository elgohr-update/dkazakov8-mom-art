/**
 * @docs: https://github.com/jantimon/html-webpack-plugin
 *
 */

import path from 'path';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { env } from '../../env';
// eslint-disable-next-line import/extensions
import pkg from '../../package.json';
import { paths } from '../../paths';

export const pluginHtml: webpack.WebpackPluginInstance = new HtmlWebpackPlugin({
  filename: 'template.html',
  template: path.resolve(paths.templates, 'template.html'),
  inject: false,
  minify: false,
  templateParameters: {
    env: env.NODE_ENV,
    version: pkg.version,
    commitHash: env.GIT_COMMIT,
  },
});
