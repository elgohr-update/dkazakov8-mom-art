/**
 * @docs: https://github.com/webpack-contrib/css-loader
 *
 */

export const loaderCss = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
    modules: {
      localIdentName: '[folder]__[local]',
    },
  },
};
