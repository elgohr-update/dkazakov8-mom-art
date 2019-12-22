/**
 * @docs: https://webpack.js.org/loaders/svg-inline-loader
 *
 */

export const ruleSvgInline = {
  test: /\.svg$/,
  use: 'svg-inline-loader',
};
