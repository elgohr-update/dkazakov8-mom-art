/**
 * @docs: https://github.com/gregberge/loadable-components
 *
 */

import webpack from 'webpack';
import LoadablePlugin from '@loadable/webpack-plugin';

export const pluginLoadable: webpack.WebpackPluginInstance = new LoadablePlugin({
  filename: 'web-loadable-stats.json',
});
