/**
 * @docs: https://webpack.js.org/concepts/plugins
 *
 */

import { env } from '../../env';
import { pluginCopy } from '../plugins/pluginCopy';
import { pluginHtml } from '../plugins/pluginHtml';
import { pluginBanner } from '../plugins/pluginBanner';
import { pluginDefine } from '../plugins/pluginDefine';
import { pluginExtract } from '../plugins/pluginExtract';
import { pluginAnalyzer } from '../plugins/pluginAnalyzer';
import { pluginWatchIgnore } from '../plugins/pluginWatchIgnore';
import { pluginCDNUploader } from '../plugins/pluginCDNUploader';
import { pluginLodashModule } from '../plugins/pluginLodashModule';
import { pluginCompressionGzip } from '../plugins/pluginCompressionGzip';
import { pluginCompressionBrotli } from '../plugins/pluginCompressionBrotli';
import { pluginCreateExportFiles } from '../plugins/pluginCreateExportFiles';
import { pluginCreateAssetsExport } from '../plugins/pluginCreateAssetsExport';
import { pluginCircularDependency } from '../plugins/pluginCircularDependency';

export const configPlugins = [
  pluginCopy,
  pluginHtml,
  pluginBanner,
  pluginDefine,
  pluginExtract,
  pluginWatchIgnore,
  pluginLodashModule,
  pluginCreateExportFiles,
  pluginCreateAssetsExport,
  env.getParamAsBoolean('BUNDLE_ANALYZER') && pluginAnalyzer,
  env.getParamAsBoolean('CIRCULAR_CHECK') && pluginCircularDependency,
  env.getParamAsBoolean('GENERATE_COMPRESSED') && pluginCompressionGzip,
  env.getParamAsBoolean('GENERATE_COMPRESSED') && pluginCompressionBrotli,
  env.getParamAsBoolean('YANDEX_STORAGE_ENABLED') && pluginCDNUploader,
].filter(Boolean);
