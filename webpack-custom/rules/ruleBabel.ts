import { paths } from '../utils/paths';
import { loaderBabel } from '../loaders/loaderBabel';
import { loaderTypescript } from '../loaders/loaderTypescript';
import { env } from '../../env';

export const ruleBabel = {
  test: /\.(js|tsx?)$/,
  use: [loaderBabel, env.getParamAsBoolean('USE_TS_LOADER') && loaderTypescript].filter(Boolean),
  exclude: [paths.nodeModulesPath],
};
