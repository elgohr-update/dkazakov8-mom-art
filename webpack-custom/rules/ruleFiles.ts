/**
 * @docs: https://webpack.js.org/loaders/file-loader
 *
 */

import { loaderFiles } from '../loaders/loaderFiles';

export const ruleFiles = {
  test: /\.(woff2?|jpe?g|png|gif)$/,
  use: [loaderFiles],
};
