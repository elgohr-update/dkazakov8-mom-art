import webpack from 'webpack';

import { env } from '../../env';
import { paths } from '../../paths';
import { loaderTypescript } from '../loaders/loaderTypescript';
import { loaderBabelServer } from '../loaders/loaderBabelServer';

export const ruleBabelServer: webpack.RuleSetRule = {
  test: /\.(jsx?|tsx?)$/,
  use: [loaderBabelServer, env.USE_TS_LOADER && loaderTypescript].filter(Boolean),
  exclude: [paths.nodeModules],
};
