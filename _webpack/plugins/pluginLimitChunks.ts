/**
 * @docs: https://webpack.js.org/plugins/limit-chunk-count-plugin
 *
 */

import webpack from 'webpack';

export const pluginLimitChunks: webpack.WebpackPluginInstance = new webpack.optimize.LimitChunkCountPlugin(
  { maxChunks: 1 }
);
