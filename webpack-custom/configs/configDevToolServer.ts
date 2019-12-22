/**
 * @docs: https://webpack.js.org/configuration/devtool
 *
 */
import webpack from 'webpack';

import { env } from '../../env';

export const configDevToolServer: webpack.Options.Devtool = (env.getParam(
  'DEV_TOOL_SERVER'
) as unknown) as false;
