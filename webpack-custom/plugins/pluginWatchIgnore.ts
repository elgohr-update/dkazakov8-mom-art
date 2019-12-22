/**
 * @docs: https://webpack.js.org/plugins/watch-ignore-plugin
 *
 */

import webpack from 'webpack';

export const pluginWatchIgnore = new webpack.WatchIgnorePlugin([/\.s?css\.d\.ts$/]);
