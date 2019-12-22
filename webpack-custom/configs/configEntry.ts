/**
 * @docs: https://webpack.js.org/configuration/entry-context
 *
 */

import path from 'path';

import { paths } from '../utils/paths';

export const configEntry = {
  client: path.resolve(paths.sourcePath, 'client.tsx'),
};
