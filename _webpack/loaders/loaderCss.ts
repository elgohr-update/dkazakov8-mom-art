/**
 * @docs: https://github.com/webpack-contrib/css-loader
 *
 */

import webpack from 'webpack';

export const loaderCss: webpack.RuleSetRule = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
    modules: {
      localIdentName: '[folder]__[local]',
    },
  },
};
