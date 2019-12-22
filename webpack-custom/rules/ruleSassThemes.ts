import { paths } from '../utils/paths';
import { loaderSassTheme } from '../loaders/loaderSassTheme';

export const ruleSassThemes = {
  test: /\.s?css$/,
  include: [paths.themesPath],
  use: [loaderSassTheme],
};
