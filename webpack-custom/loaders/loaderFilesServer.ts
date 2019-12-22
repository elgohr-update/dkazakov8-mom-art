/**
 * @docs: https://github.com/webpack-contrib/file-loader
 *
 */

export const loaderFilesServer = {
  loader: 'file-loader',
  options: {
    name: '[contenthash].[ext]',
    outputPath: 'images',
    emitFile: false,
  },
};
