/**
 * @docs: https://webpack.js.org/plugins/banner-plugin
 *
 */

import webpack from 'webpack';

// eslint-disable-next-line import/extensions
import pkg from '../../package.json';
import { commitHash } from '../utils/commitHash';

export const pluginBanner = new webpack.BannerPlugin({
  banner: `@env ${commitHash}:${pkg.version} @commit ${commitHash}`,
  entryOnly: false,
});
