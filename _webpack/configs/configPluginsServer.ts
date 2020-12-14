/**
 * @docs: https://webpack.js.org/concepts/plugins
 *
 */

import webpack from 'webpack';

import { env } from '../../env';
import { pluginLimitChunks } from '../plugins/pluginLimitChunks';
import { pluginDefineServer } from '../plugins/pluginDefineServer';
import { pluginChangedFiles } from '../plugins/pluginChangedFiles';

export const configPluginsServer: webpack.Configuration['plugins'] = [
  pluginDefineServer,
  pluginLimitChunks,
  env.LOGS_WATCHED_FILES && pluginChangedFiles('[WEBPACK server]'),
].filter(Boolean);
