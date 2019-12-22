/**
 * @docs: https://webpack.js.org/configuration/output
 *
 */

import { paths } from '../utils/paths';

export const configOutputServer = {
  path: paths.buildPath,
  filename: '[name].js', // static name for server build
  publicPath: '/',
};
