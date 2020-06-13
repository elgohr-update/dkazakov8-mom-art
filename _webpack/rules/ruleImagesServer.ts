/**
 * @docs: https://webpack.js.org/loaders/file-loader
 *
 */

import webpack from 'webpack';

import { loaderImagesServer } from '../loaders/loaderImagesServer';

export const ruleImagesServer: webpack.RuleSetRule = {
  test: /\.(woff2?|jpe?g|png|gif)$/,
  use: [loaderImagesServer],
};
