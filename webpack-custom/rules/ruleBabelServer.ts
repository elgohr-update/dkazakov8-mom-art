import { env } from '../../env';
import { paths } from '../utils/paths';
import { loaderTypescript } from '../loaders/loaderTypescript';
import { loaderBabelServer } from '../loaders/loaderBabelServer';

export const ruleBabelServer = {
  test: /\.(js|tsx?)$/,
  use: [loaderBabelServer, env.getParamAsBoolean('USE_TS_LOADER') && loaderTypescript].filter(
    Boolean
  ),
  exclude: [paths.nodeModulesPath],
};
