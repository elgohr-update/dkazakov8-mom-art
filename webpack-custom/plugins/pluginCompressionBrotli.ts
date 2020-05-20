/**
 * @docs: https://webpack.js.org/plugins/compression-webpack-plugin
 *
 */

import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';

export const pluginCompressionBrotli: webpack.Plugin = new CompressionPlugin({
  test: /\.(js|css)$/i,
  cache: true,
  filename: '[path].br[query]',
  algorithm: 'brotliCompress',
  deleteOriginalAssets: false,
  compressionOptions: {
    level: 11,
  },
});
