/**
 * @docs: https://github.com/babel/babel-loader
 *
 */

import webpack from 'webpack';

import { env } from '../../env';
import babelConfigServer from '../../babel.config';

export const loaderBabelServer: webpack.RuleSetLoader = {
  loader: 'babel-loader',
  options: {
    presets: babelConfigServer.presets,
    plugins: [
      ...babelConfigServer.plugins,
      env.REACT_LIBRARY === 'react'
        ? '@babel/plugin-transform-react-jsx'
        : ['babel-plugin-inferno', { imports: true }],
    ],
  },
};
