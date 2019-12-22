/**
 * @docs: https://webpack.js.org/loaders/file-loader
 *
 */

import { loaderFilesServer } from '../loaders/loaderFilesServer';

export const ruleFilesServer = {
  test: /\.(woff2?|jpe?g|png|gif)$/,
  use: [loaderFilesServer],
};
