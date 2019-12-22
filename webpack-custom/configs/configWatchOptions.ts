/**
 * @docs: https://webpack.js.org/configuration/watch
 *
 */

import { env } from '../../env';

export const configWatchOptions = {
  aggregateTimeout: env.getParamAsNumber('AGGREGATION_TIMEOUT'),
};
