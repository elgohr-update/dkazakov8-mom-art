import webpack from 'webpack';

import { paths } from '../../paths';
import { loaderSassTheme } from '../loaders/loaderSassTheme';

export const ruleSassThemes: webpack.RuleSetRule = {
  test: /\.s?css$/,
  include: [paths.themes],
  use: [loaderSassTheme],
};
