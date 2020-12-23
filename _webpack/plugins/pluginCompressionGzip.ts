/**
 * @docs: https://webpack.js.org/plugins/compression-webpack-plugin
 *
 */

import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';

export const pluginCompressionGzip: webpack.WebpackPluginInstance = new CompressionPlugin({
  test: /\.(js|css)$/i,
  filename: '[name][ext].gz',
  algorithm: 'gzip',
  deleteOriginalAssets: false,
  compressionOptions: {
    level: 9,
  },
});
