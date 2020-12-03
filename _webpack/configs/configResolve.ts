/**
 * @docs: https://webpack.js.org/configuration/resolve
 *
 */

import webpack from 'webpack';

import { paths } from '../../paths';

export const configResolve: webpack.Configuration['resolve'] = {
  // Allow looking in server & src folders for imports
  modules: [paths.nodeModules, paths.source, paths.types],
  extensions: ['.js', '.ts', '.tsx'],
  symlinks: false,
  cacheWithContext: false,
  alias: {
    env: paths.env,
    paths: paths.paths,
    Server: paths.server,
  },
  fallback: {
    path: require.resolve('path-browserify'),
  },
};
