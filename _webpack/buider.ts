import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

import watch from 'node-watch';
import dotenv from 'dotenv';
import fsExtra from 'fs-extra';
// @ts-ignore
import { run } from 'parallel-webpack';

import { env } from '../env';
import { paths } from '../paths';

import { generateFiles } from './utils/generateFiles';

process.traceDeprecation = true;

function startFileWatcher() {
  let changedFiles = [];
  let isGenerating = false;
  let watchDebounceTimeout = null;

  watch(paths.source, { recursive: true }, function fileChanged(event, filePath) {
    if (filePath) changedFiles.push(filePath);

    if (isGenerating) return false;

    clearTimeout(watchDebounceTimeout);
    watchDebounceTimeout = setTimeout(() => {
      isGenerating = true;

      generateFiles.process({ changedFiles }).then(() => {
        isGenerating = false;

        if (changedFiles.length > 0) fileChanged(null, null);
      });

      changedFiles = [];
    }, 10);
  });
}

function afterFirstBuild() {
  startFileWatcher();
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

function compareEnvFiles() {
  function difference(arr1: string[], arr2: string[]) {
    return arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
  }

  const envConfigs = ['.env', 'example.dev.env', 'example.prod.env'].map(fileName => {
    const envPath = path.resolve(paths.root, fileName);

    return { fileName, keys: Object.keys(dotenv.parse(fs.readFileSync(envPath))) };
  });

  const comparisonMatrix = [
    [0, 1],
    [0, 2],
    [1, 2],
  ];

  const parsedEnvKeys = Object.keys(env);

  comparisonMatrix.forEach(([firstConfigIndex, secondConfigIndex]) => {
    const { keys: firstConfigKeys, fileName: firstConfigFilename } = envConfigs[firstConfigIndex];
    const { keys: secondConfigKeys, fileName: secondConfigFilename } = envConfigs[
      secondConfigIndex
    ];

    const diff = difference(firstConfigKeys, secondConfigKeys);
    const firstDiffWithParsedKeys = firstConfigKeys.filter(x => !parsedEnvKeys.includes(x));
    const secondDiffWithParsedKeys = secondConfigKeys.filter(x => !parsedEnvKeys.includes(x));

    if (diff.length > 0) {
      throw new Error(
        `${firstConfigFilename} & ${secondConfigFilename} have different keys: ${diff}`
      );
    } else if (firstDiffWithParsedKeys.length > 0) {
      throw new Error(
        `${firstConfigFilename} has not listed in env.ts keys: ${firstDiffWithParsedKeys}`
      );
    } else if (secondDiffWithParsedKeys.length > 0) {
      throw new Error(
        `${secondConfigFilename} has not listed in env.ts keys: ${secondDiffWithParsedKeys}`
      );
    }
  });
}

const parallelOptions = {
  stats: true,
  watch: env.HOT_RELOAD,
  colors: true,
  maxRetries: 1,
  maxConcurrentWorkers: 2,
};

/**
 * Unfortunately parallel-webpack requires absolute path to config as the first argument
 * instead of configurations array. So, have to create additional file like
 * webpackParallel.config.js
 *
 * @docs: https://github.com/trivago/parallel-webpack
 *
 */

Promise.resolve()
  .then(() => compareEnvFiles())
  .then(() => fsExtra.emptyDirSync(paths.build))
  .then(() => generateFiles.process({}))
  .then(() => run(path.resolve(__dirname, 'parallel.config.ts'), parallelOptions, afterFirstBuild))
  .catch(console.error);
