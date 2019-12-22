/**
 * @docs: https://github.com/webpack-contrib/file-loader
 *
 */

export const loaderFiles = {
  loader: 'file-loader',
  options: {
    name: '[contenthash].[ext]',
    outputPath: 'images',
    emitFile: true,
  },
};
