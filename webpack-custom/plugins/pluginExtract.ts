/**
 * @docs: https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { env } from '../../env';

export const pluginExtract = new MiniCssExtractPlugin({
  filename: env.getParamAsBoolean('FILENAME_HASH') ? '[name].[contenthash].css' : '[name].css',
  ignoreOrder: false,
});
