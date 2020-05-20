import webpack from 'webpack';

import { paths } from '../../paths';
import { loaderCss } from '../loaders/loaderCss';
import { loaderPostcss } from '../loaders/loaderPostcss';
import { loaderExtractCss } from '../loaders/loaderExtractCss';
import { loaderCssTypings } from '../loaders/loaderCssTypings';

export const ruleSass: webpack.Rule = {
  test: /\.s?css$/,
  include: [paths.sourcePath],
  exclude: [paths.themesPath],
  use: [loaderExtractCss, loaderCssTypings, loaderCss, loaderPostcss],
};
