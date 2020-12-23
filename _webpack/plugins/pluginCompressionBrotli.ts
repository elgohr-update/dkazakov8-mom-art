/**
 * @docs: https://webpack.js.org/plugins/compression-webpack-plugin
 *
 */

import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';

export const pluginCompressionBrotli: webpack.WebpackPluginInstance = new CompressionPlugin({
  test: /\.(js|css)$/i,
  filename: '[name][ext].br',
  algorithm: 'brotliCompress',
  deleteOriginalAssets: false,
  compressionOptions: {
    level: 11,
  },
});
