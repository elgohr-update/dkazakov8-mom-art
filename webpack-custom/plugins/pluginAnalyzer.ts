/**
 * @docs: https://github.com/webpack-contrib/webpack-bundle-analyzer
 *
 */

import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { env } from '../../env';

export const pluginAnalyzer: webpack.Plugin = new BundleAnalyzerPlugin({
  logLevel: 'silent',
  analyzerPort: env.BUNDLE_ANALYZER_PORT,
  statsOptions: null,
  openAnalyzer: false,
  analyzerMode: 'server',
  defaultSizes: 'parsed',
  analyzerHost: '127.0.0.1',
  statsFilename: 'stats.json',
  reportFilename: 'report.html',
  generateStatsFile: false,
});
