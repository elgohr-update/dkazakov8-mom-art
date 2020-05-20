/**
 * @docs: https://github.com/stephencookdev/speed-measure-webpack-plugin
 *
 */

import webpack from 'webpack';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';

import { env } from '../../env';

export const pluginSpeedMeasureServer: {
  wrap: (config: webpack.Configuration) => void;
} = new SpeedMeasurePlugin({
  disable: !env.SPEED_ANALYZER_SERVER,
  outputFormat: 'human',
});
