/**
 * @docs: https://webpack.js.org/guides/shimming/#granular-shimming
 *
 */

import webpack from 'webpack';

export const ruleLegacyFiles: webpack.RuleSetRule = {
  test: /node_modules[\\/]vfile[\\/]core\.js/,
  use: [
    {
      loader: 'imports-loader',
      options: {
        type: 'commonjs',
        imports: ['single process/browser process'],
      },
    },
  ],
};
