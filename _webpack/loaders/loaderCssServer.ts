/**
 * @docs: https://github.com/webpack-contrib/css-loader
 *
 */

import webpack from 'webpack';

export const loaderCssServer: webpack.RuleSetRule = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
    modules: {
      localIdentName: '[folder]__[local]',
      exportOnlyLocals: true,
    },
  },
};
