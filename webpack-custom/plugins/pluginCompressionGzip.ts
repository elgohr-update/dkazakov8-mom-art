/**
 * @docs: https://webpack.js.org/plugins/compression-webpack-plugin
 *
 */

import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';

export const pluginCompressionGzip: webpack.Plugin = new CompressionPlugin({
  test: /\.(js|css)$/i,
  cache: true,
  filename: '[path].gz[query]',
  algorithm: 'gzip',
  deleteOriginalAssets: false,
  compressionOptions: {
    level: 9,
  },
});
