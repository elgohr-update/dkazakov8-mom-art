/**
 * @docs: https://webpack.js.org/plugins/define-plugin
 *
 */

import webpack from 'webpack';

import { getDefineParams } from '../utils/getDefineParams';

export const pluginDefineServer: webpack.DefinePlugin = new webpack.DefinePlugin(
  getDefineParams({ isClient: false })
);
