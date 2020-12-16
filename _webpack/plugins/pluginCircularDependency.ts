/**
 * @docs: https://github.com/aackerman/circular-dependency-plugin
 *
 */

import CircularDependencyPlugin from 'circular-dependency-plugin';

export const pluginCircularDependency: any = new CircularDependencyPlugin({
  exclude: /node_modules/,
  failOnError: true,
  allowAsyncCycles: true,
  cwd: process.cwd(),
});
