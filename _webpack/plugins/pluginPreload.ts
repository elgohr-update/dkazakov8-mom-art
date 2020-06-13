/**
 * @docs: https://github.com/GoogleChromeLabs/preload-webpack-plugin
 *
 */

import webpack from 'webpack';
import PreloadWebpackPlugin from 'preload-webpack-plugin';

export const pluginPreload: webpack.WebpackPluginInstance = new PreloadWebpackPlugin({
  rel: 'preload',
  include: 'allAssets',
  fileWhitelist: [/\.woff2/],
});
