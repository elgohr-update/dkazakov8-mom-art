/**
 * @docs: https://github.com/aackerman/circular-dependency-plugin
 *
 */

import CircularDependencyPlugin from 'circular-dependency-plugin';

export const pluginCircularDependency = new CircularDependencyPlugin({
  exclude: /node_modules/,
  failOnError: true,
  allowAsyncCycles: false,
  cwd: process.cwd(),
});
