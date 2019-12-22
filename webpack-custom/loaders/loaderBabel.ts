/**
 * @docs: https://github.com/babel/babel-loader
 *
 */

import { env } from '../../env';

const presetEnvOptions = env.getParamAsBoolean('POLYFILLING')
  ? {
      corejs: 3,
      useBuiltIns: 'usage',
    }
  : undefined;

export const loaderBabel = {
  loader: 'babel-loader',
  options: {
    presets: [
      ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
      ['@babel/preset-env', presetEnvOptions],
    ],
    plugins: [
      env.getParam('REACT_LIBRARY') === 'react'
        ? '@babel/plugin-transform-react-jsx'
        : ['babel-plugin-inferno', { imports: true }],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      'lodash',
    ],
  },
};
