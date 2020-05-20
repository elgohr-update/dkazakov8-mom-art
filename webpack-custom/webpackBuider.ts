import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

import { env } from '../env';
import { run } from '../lib/parallel-webpack';
import { paths } from '../paths';
import { createCDNBucket } from '../server/serverUtils/s3';
import { deleteRecursive } from '../server/serverUtils/deleteRecursive';

import { generateFiles } from './utils/generateFiles';

function afterFirstBuild() {
  /**
   * Start server & proxy it's stdout/stderr to current console
   *
   */

  if (!env.START_SERVER_AFTER_BUILD) return false;

  const serverProcess = exec('better-npm-run -s start');

  serverProcess.stdout.on('data', msg => console.log('[server]', msg.trim()));
  serverProcess.stderr.on('data', msg => console.error('[server]', msg.trim()));

  /**
   * Start watch server & proxy it's stdout/stderr to current console
   *
   */

  if (!env.HOT_RELOAD) return false;

  const reloadServerProcess = exec('better-npm-run -s reload-browser');

  reloadServerProcess.stdout.on('data', msg => console.log('[reload-browser]', msg.trim()));
  reloadServerProcess.stderr.on('data', msg => console.error('[reload-browser]', msg.trim()));
}

/**
 * Unfortunately parallel-webpack requires absolute path to config as the first argument
 * instead of configurations array. So, have to create additional file like
 * webpackParallel.config.js
 *
 * @docs: https://github.com/trivago/parallel-webpack
 *
 */

Promise.resolve()
  .then(() =>
    env.YANDEX_STORAGE_ENABLED
      ? createCDNBucket({ bucketName: `${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.GIT_COMMIT}` })
      : Promise.resolve()
  )
  .then(() => deleteRecursive(paths.buildPath))
  .then(() => fs.promises.mkdir(paths.buildPath))
  .then(() => generateFiles.process({}))
  .then(() =>
    run(
      path.resolve(__dirname, 'webpackParallel.config.ts'),
      {
        stats: true,
        watch: env.START_SERVER_AFTER_BUILD,
        colors: true,
        maxRetries: 1,
        maxConcurrentWorkers: 2,
        beforeRebuild: generateFiles.process.bind(generateFiles),
      },
      afterFirstBuild
    )
  )
  .catch(console.error);
