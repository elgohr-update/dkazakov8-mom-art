/**
 * @docs: https://webpack.js.org/configuration/devtool
 *
 */
import webpack from 'webpack';

import { env } from '../../env';

export const configDevTool: webpack.Options.Devtool = (env.getParam(
  'DEV_TOOL'
) as unknown) as false;
