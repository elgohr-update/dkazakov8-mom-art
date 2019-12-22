/**
 * @docs: https://webpack.js.org/configuration/resolve
 *
 */

import { env } from '../../env';
import { paths } from '../utils/paths';

export const configResolve = {
  // Allow looking in server & src folders for imports
  modules: [paths.serverPath, paths.sourcePath, paths.nodeModulesPath, paths.typesPath],
  extensions: ['.js', '.ts', '.tsx'],
  alias: {
    inferno:
      env.getParam('NODE_ENV') === 'production' ? 'inferno' : 'inferno/dist/index.dev.esm.js',
    react: env.getParam('REACT_LIBRARY') === 'react' ? 'react' : 'inferno-compat',
    'react-dom': env.getParam('REACT_LIBRARY') === 'react' ? 'react-dom' : 'inferno-compat',
    'mobx-react': env.getParam('REACT_LIBRARY') === 'react' ? 'mobx-react' : 'inferno-mobx',
    'react-dom/server':
      env.getParam('REACT_LIBRARY') === 'react' ? 'react-dom/server' : 'inferno-server',
  },
};
