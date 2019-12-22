/**
 * @docs: https://github.com/webpack-contrib/css-loader
 *
 */

export const loaderCssServer = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
    onlyLocals: true,
    modules: {
      localIdentName: '[folder]__[local]',
    },
  },
};
