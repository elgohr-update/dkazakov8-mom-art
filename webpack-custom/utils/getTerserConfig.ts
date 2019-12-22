import TerserPlugin from 'terser-webpack-plugin';

import { env } from '../../env';

export function getTerserConfig() {
  return new TerserPlugin({
    sourceMap: true,
    terserOptions: {
      warnings: false,
      compress: {
        drop_console: env.getParamAsBoolean('DROP_CONSOLE'),
      },
      output: {
        beautify: false,
        comments: false,
      },
    },
  });
}
