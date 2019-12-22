/**
 * @docs: https://github.com/jantimon/html-webpack-plugin
 *
 */

import path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';

import { env } from '../../env';
// eslint-disable-next-line import/extensions
import pkg from '../../package.json';
import { paths } from '../utils/paths';
import { commitHash } from '../utils/commitHash';

export const pluginHtml = new HtmlWebpackPlugin({
  filename: 'template.html',
  template: path.resolve(paths.templatesPath, 'template.html'),
  inject: 'body',
  minify: false,
  templateParameters: {
    env: env.getParam('NODE_ENV'),
    version: pkg.version,
    commitHash,
  },
});
