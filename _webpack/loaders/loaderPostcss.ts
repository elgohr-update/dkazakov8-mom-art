/**
 * @docs: https://github.com/postcss/postcss-loader
 *
 */

import webpack from 'webpack';

import { paths } from '../../paths';
import { env } from '../../env';

export const loaderPostcss: webpack.RuleSetRule = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      parser: 'postcss-scss',
      plugins: [
        ['postcss-import', { root: paths.source, path: [paths.styles] }],
        ['postcss-advanced-variables'],
        ['postcss-sass-color-functions'],
        ['postcss-nested'],
        ['postcss-automath'],
        [
          'postcss-preset-env',
          {
            autoprefixer: env.POLYFILLING ? undefined : false,
            stage: 4,
          },
        ],
      ],
    },
  },
};
