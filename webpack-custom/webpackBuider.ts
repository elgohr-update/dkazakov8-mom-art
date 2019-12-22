import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

import { run } from 'parallel-webpack';
import S3 from 'aws-sdk/clients/s3';

import { env } from '../env';

import { paths } from './utils/paths';
import { cdnBucketName } from './utils/cdnBucketName';

function createCDNBucket() {
  const s3 = new S3({
    credentials: {
      accessKeyId: env.getParam('YANDEX_STORAGE_ACCESS_KEY_ID'),
      secretAccessKey: env.getParam('YANDEX_STORAGE_SECRET_ACCESS_KEY'),
    },
    region: 'ru-central1',
    endpoint: 'https://storage.yandexcloud.net',
  });

  return new Promise((resolve, reject) => {
    s3.headBucket({ Bucket: cdnBucketName }, err => {
      // bucket exists, use it
      if (!err) return resolve();

      // bucket does not exist, create one
      if (err.statusCode >= 400 && err.statusCode < 500) {
        return s3.createBucket({ Bucket: cdnBucketName }, err2 => (err2 ? reject(err) : resolve()));
      }

      // unexpected error
      return reject(err);
    });
  });
}

const CDNEnabled = env.getParamAsBoolean('YANDEX_STORAGE_ENABLED');

/**
 * Unfortunately parallel-webpack requires absolute path to config as the first argument
 * instead of configurations array. So, have to create additional file like
 * webpackParallel.config.js
 *
 * @docs: https://github.com/trivago/parallel-webpack
 *
 */

const isDevMode = env.getParamAsBoolean('START_SERVER_AFTER_BUILD');
const hotReloadEnabled = env.getParamAsBoolean('HOT_RELOAD');
const webpackParallelConfigPath = path.resolve(__dirname, 'webpackParallel.config.ts');
const webpackParallelOptions = {
  stats: true,
  watch: isDevMode,
  colors: true,
  maxRetries: 1,
  maxConcurrentWorkers: 2,
};

function deleteRecursiveSync(src) {
  if (!fs.existsSync(src)) {
    return false;
  }

  fs.readdirSync(src).forEach(fileName => {
    const filePath = path.join(src, fileName);

    if (fs.statSync(filePath).isDirectory()) {
      return deleteRecursiveSync(filePath);
    }

    fs.unlinkSync(filePath);
  });

  fs.rmdirSync(src);
}

function afterFirstBuild() {
  /**
   * Start server & proxy it's stdout/stderr to current console
   *
   */

  if (!isDevMode) {
    return false;
  }

  const serverProcess = exec('better-npm-run -s start');

  serverProcess.stdout.on('data', function onStdout(message) {
    console.log('[server]', message.trim());
  });

  serverProcess.stderr.on('data', function onStderr(message) {
    console.error('[server]', message.trim());
  });

  if (hotReloadEnabled) {
    const reloadServerProcess = exec('better-npm-run -s reload-browser');

    reloadServerProcess.stdout.on('data', function onStdout(message) {
      console.log('[reload-browser]', message.trim());
    });

    reloadServerProcess.stderr.on('data', function onStderr(message) {
      console.log('[reload-browser]', message.trim());
    });
  }

  console.log(`[server] Server started ${hotReloadEnabled ? 'with' : 'without'} hot reload.`);
}

Promise.resolve()
  .then(() => (CDNEnabled ? createCDNBucket() : Promise.resolve()))
  .then(() => deleteRecursiveSync(paths.buildPath))
  .then(() => new Promise(resolve => setTimeout(resolve, 5)))
  .then(() => fs.mkdirSync(paths.buildPath))
  .then(() => run(webpackParallelConfigPath, webpackParallelOptions, afterFirstBuild))
  .catch(console.error);
