/**
 * @docs: https://webpack.js.org/concepts/plugins
 *
 */

import { pluginWatchIgnore } from '../plugins/pluginWatchIgnore';
import { pluginDefineServer } from '../plugins/pluginDefineServer';
import { pluginCreateExportFiles } from '../plugins/pluginCreateExportFiles';

export const configPluginsServer = [pluginWatchIgnore, pluginDefineServer, pluginCreateExportFiles];
