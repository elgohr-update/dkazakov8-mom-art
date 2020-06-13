/**
 * @docs: https://webpack.js.org/loaders/file-loader
 *
 */

import webpack from 'webpack';

import { loaderImages } from '../loaders/loaderImages';

export const ruleImages: webpack.RuleSetRule = {
  test: /\.(jpe?g|png|gif)$/,
  use: [loaderImages],
};
