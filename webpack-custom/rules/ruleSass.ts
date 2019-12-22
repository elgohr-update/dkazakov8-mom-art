import { paths } from '../utils/paths';
import { loaderCss } from '../loaders/loaderCss';
import { loaderPostcss } from '../loaders/loaderPostcss';
import { loaderExtractCss } from '../loaders/loaderExtractCss';
import { loaderCssTypings } from '../loaders/loaderCssTypings';

export const ruleSass = {
  test: /\.s?css$/,
  include: [paths.sourcePath],
  exclude: [paths.themesPath],
  use: [loaderExtractCss, loaderCssTypings, loaderCss, loaderPostcss],
};
