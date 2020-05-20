/**
 * @docs: https://webpack.js.org/configuration/output
 *
 */

import webpack from 'webpack';

import { env } from '../../env';
import { paths } from '../../paths';

let publicPath = '/';
if (env.YANDEX_STORAGE_ENABLED && env.YANDEX_STORAGE_COPY_TO_PROD) {
  publicPath = `${env.YANDEX_STORAGE_ENDPOINT}/${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.YANDEX_STORAGE_BUCKET}/`;
} else if (env.YANDEX_STORAGE_ENABLED) {
  publicPath = `${env.YANDEX_STORAGE_ENDPOINT}/${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.GIT_COMMIT}/`;
}

export const configOutput: webpack.Configuration['output'] = {
  path: paths.buildPath,
  filename: env.FILENAME_HASH ? '[name].[contenthash].js' : '[name].js',
  publicPath,
};
