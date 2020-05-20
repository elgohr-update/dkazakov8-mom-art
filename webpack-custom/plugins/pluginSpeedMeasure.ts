/**
 * @docs: https://github.com/stephencookdev/speed-measure-webpack-plugin
 *
 */

import webpack from 'webpack';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';

import { env } from '../../env';

export const pluginSpeedMeasure: {
  wrap: (config: webpack.Configuration) => void;
} = new SpeedMeasurePlugin({
  disable: !env.SPEED_ANALYZER,
  outputFormat: 'human',
});
