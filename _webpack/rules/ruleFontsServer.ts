/**
 * @docs: https://webpack.js.org/loaders/file-loader
 *
 */

import webpack from 'webpack';

import { loaderFontsServer } from '../loaders/loaderFontsServer';

export const ruleFontsServer: webpack.RuleSetRule = {
  test: /\.(woff2?|eot|ttf)$/,
  use: [loaderFontsServer],
};
