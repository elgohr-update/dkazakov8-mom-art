/**
 * @docs: https://webpack.js.org/configuration/entry-context
 *
 */

import path from 'path';

import { paths } from '../utils/paths';

export const configEntryServer = {
  server: path.resolve(paths.serverPath, 'server.ts'),
};
