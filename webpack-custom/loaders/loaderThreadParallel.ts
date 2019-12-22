/**
 * @docs: https://github.com/webpack-contrib/thread-loader
 *
 */

export const loaderThreadParallel = {
  loader: 'thread-loader',
  options: {
    workers: 4,
    poolParallelJobs: 50,
  },
};
