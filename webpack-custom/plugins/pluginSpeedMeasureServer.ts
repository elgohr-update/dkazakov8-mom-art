/**
 * @docs: https://github.com/stephencookdev/speed-measure-webpack-plugin
 *
 */

import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';

import { env } from '../../env';

export const pluginSpeedMeasureServer = new SpeedMeasurePlugin({
  disable: !env.getParamAsBoolean('SPEED_ANALYZER_SERVER'),
  outputFormat: 'human',
});
