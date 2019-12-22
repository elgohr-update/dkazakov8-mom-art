/**
 * @docs: https://webpack.js.org/configuration/output
 *
 */

import { env } from '../../env';
import { paths } from '../utils/paths';

export const configOutput = {
  path: paths.buildPath,
  filename: env.getParamAsBoolean('FILENAME_HASH') ? '[name].[contenthash].js' : '[name].js',
  publicPath: '/',
};
