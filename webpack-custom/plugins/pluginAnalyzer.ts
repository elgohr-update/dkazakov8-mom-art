/**
 * @docs: https://github.com/webpack-contrib/webpack-bundle-analyzer
 *
 */

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { env } from '../../env';

export const pluginAnalyzer = new BundleAnalyzerPlugin({
  logLevel: 'silent',
  analyzerPort: env.getParamAsNumber('BUNDLE_ANALYZER_PORT'),
  statsOptions: null,
  openAnalyzer: false,
  analyzerMode: 'server',
  defaultSizes: 'parsed',
  analyzerHost: '127.0.0.1',
  statsFilename: 'stats.json',
  reportFilename: 'report.html',
  generateStatsFile: false,
});
