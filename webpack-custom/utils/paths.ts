import path from 'path';

const rootPath = path.resolve(__dirname, '../../');

export const paths = {
  rootPath,
  buildPath: path.resolve(rootPath, 'build'),
  typesPath: path.resolve(rootPath, 'types-custom'),
  assetsPath: path.resolve(rootPath, 'src/assets'),
  serverPath: path.resolve(rootPath, 'server'),
  sourcePath: path.resolve(rootPath, 'src'),
  stylesPath: path.resolve(rootPath, 'src/styles'),
  themesPath: path.resolve(rootPath, 'src/styles/themes.scss'),
  templatesPath: path.resolve(rootPath, 'templates'),
  nodeModulesPath: path.resolve(rootPath, 'node_modules'),
};
