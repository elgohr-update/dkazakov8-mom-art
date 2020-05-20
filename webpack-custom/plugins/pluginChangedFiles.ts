import webpack from 'webpack';

class ChangedFiles {
  logsPrefix: string;

  constructor({ logsPrefix }) {
    this.logsPrefix = logsPrefix;
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.watchRun.tapAsync('WatchRun', (comp, done) => {
      // @ts-ignore
      const watcher = comp.watchFileSystem.watcher || comp.watchFileSystem.wfs.watcher;

      const changedTimes = watcher.mtimes;
      const changedFiles = Object.keys(changedTimes);

      if (changedFiles.length) {
        console.log(`${this.logsPrefix} watched files changed:\n`, changedFiles);
      }

      done();
    });
  }
}

export const pluginChangedFiles = (logsPrefix: string): webpack.Plugin => {
  return new ChangedFiles({ logsPrefix });
};
