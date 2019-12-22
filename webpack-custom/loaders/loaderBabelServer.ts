/**
 * @docs: https://github.com/babel/babel-loader
 *
 */

import { env } from '../../env';
import babelConfigServer from '../../babel.config';

export const loaderBabelServer = {
  loader: 'babel-loader',
  options: {
    ...babelConfigServer,
    plugins: [
      env.getParam('REACT_LIBRARY') === 'react'
        ? '@babel/plugin-transform-react-jsx'
        : ['babel-plugin-inferno', { imports: true }],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
  },
};
