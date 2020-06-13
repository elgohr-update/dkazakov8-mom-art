/**
 * @docs: https://webpack.js.org/plugins/banner-plugin
 *
 */

import webpack from 'webpack';

// eslint-disable-next-line import/extensions
import pkg from '../../package.json';
import { env } from '../../env';

export const pluginBanner: webpack.WebpackPluginInstance = new webpack.BannerPlugin({
  banner: `@env ${env.NODE_ENV}:${pkg.version} @commit ${env.GIT_COMMIT}`,
  entryOnly: false,
});
