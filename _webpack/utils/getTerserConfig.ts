import TerserPlugin from 'terser-webpack-plugin';

import { env } from '../../env';

export function getTerserConfig() {
  return new TerserPlugin({
    parallel: true,
    terserOptions: {
      sourceMap: true,
      keep_fnames: true,
      keep_classnames: true,
      compress: {
        drop_console: env.DROP_CONSOLE,
      },
      output: {
        beautify: false,
        comments: /^!\s@env/,
      },
    },
  });
}
