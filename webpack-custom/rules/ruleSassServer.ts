import { paths } from '../utils/paths';
import { loaderPostcss } from '../loaders/loaderPostcss';
import { loaderCssServer } from '../loaders/loaderCssServer';

export const ruleSassServer = {
  test: /\.s?css$/,
  include: [paths.sourcePath],
  exclude: [paths.themesPath],
  use: [loaderCssServer, loaderPostcss],
};
