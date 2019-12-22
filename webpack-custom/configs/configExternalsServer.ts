/**
 * @docs: https://webpack.js.org/configuration/externals
 *
 */

import nodeExternals from 'webpack-node-externals';

export const configExternalsServer = [nodeExternals({ whitelist: ['react-markdown'] })];
