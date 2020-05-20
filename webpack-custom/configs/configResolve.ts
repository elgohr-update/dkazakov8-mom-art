/**
 * @docs: https://webpack.js.org/configuration/resolve
 *
 */

import webpack from 'webpack';

import { env } from '../../env';
import { paths } from '../../paths';

export const configResolve: webpack.Configuration['resolve'] = {
  // Allow looking in server & src folders for imports
  modules: [paths.serverPath, paths.sourcePath, paths.nodeModulesPath, paths.typesPath],
  extensions: ['.js', '.ts', '.tsx'],
  alias: {
    inferno: env.NODE_ENV === 'production' ? 'inferno' : 'inferno/dist/index.dev.esm.js',
    react: env.REACT_LIBRARY === 'react' ? 'react' : 'inferno-compat',
    'react-dom': env.REACT_LIBRARY === 'react' ? 'react-dom' : 'inferno-compat',
    'mobx-react': env.REACT_LIBRARY === 'react' ? 'mobx-react' : 'inferno-mobx',
    'react-dom/server': env.REACT_LIBRARY === 'react' ? 'react-dom/server' : 'inferno-server',
  },
};
