import path from 'path';

import webpack from 'webpack';

export const loaderSassTheme: webpack.RuleSetRule = {
  loader: path.resolve(__dirname, '../utils/sassVariablesLoader.ts'),
};
