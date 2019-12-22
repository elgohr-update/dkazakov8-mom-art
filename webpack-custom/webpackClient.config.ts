import webpack from 'webpack';

import { configMode } from './configs/configMode';
import { configNode } from './configs/configNode';
import { configStats } from './configs/configStats';
import { configEntry } from './configs/configEntry';
import { configOutput } from './configs/configOutput';
import { configModule } from './configs/configModule';
import { configDevTool } from './configs/configDevTool';
import { configPlugins } from './configs/configPlugins';
import { configResolve } from './configs/configResolve';
import { configPerformance } from './configs/configPerformance';
import { configOptimization } from './configs/configOptimization';
import { configWatchOptions } from './configs/configWatchOptions';
import { pluginSpeedMeasure } from './plugins/pluginSpeedMeasure';

export default (pluginSpeedMeasure as { wrap: (config: webpack.Configuration) => void }).wrap({
  mode: configMode,
  node: configNode,
  entry: configEntry,
  stats: configStats,
  module: configModule,
  output: configOutput,
  target: 'web',
  devtool: configDevTool,
  plugins: configPlugins,
  resolve: configResolve,
  performance: configPerformance,
  optimization: configOptimization,
  watchOptions: configWatchOptions,
});
