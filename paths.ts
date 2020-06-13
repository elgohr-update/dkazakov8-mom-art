import path from 'path';

const rootPath = __dirname;

const paths: {
  rootPath: string;
  buildPath: string;
  typesPath: string;
  assetsPath: string;
  serverPath: string;
  sourcePath: string;
  stylesPath: string;
  themesPath: string;
  templatesPath: string;
  validatorsPath: string;
  nodeModulesPath: string;
  generateValidationsConfig?: Array<{ folderPath: string }>;
  generateExportFilesConfig?: Array<{ folderPath: string; exportDefault: boolean }>;
  generateAssetsExportFilesConfig?: Array<{ folderPath: string; exportDefault: boolean }>;
} = {
  rootPath,
  buildPath: path.resolve(rootPath, 'build'),
  typesPath: path.resolve(rootPath, '_types'),
  assetsPath: path.resolve(rootPath, 'src/assets'),
  serverPath: path.resolve(rootPath, 'server'),
  sourcePath: path.resolve(rootPath, 'src'),
  stylesPath: path.resolve(rootPath, 'src/styles'),
  themesPath: path.resolve(rootPath, 'src/styles/themes.scss'),
  templatesPath: path.resolve(rootPath, 'templates'),
  validatorsPath: path.resolve(rootPath, 'src/validators'),
  nodeModulesPath: path.resolve(rootPath, 'node_modules'),
};

paths.generateValidationsConfig = [
  {
    folderPath: path.resolve(paths.sourcePath, 'api'),
  },
];
paths.generateExportFilesConfig = [
  {
    folderPath: path.resolve(paths.sourcePath, 'formConfigs'),
    exportDefault: false,
  },
  {
    folderPath: path.resolve(paths.sourcePath, 'const'),
    exportDefault: false,
  },
  {
    folderPath: path.resolve(paths.sourcePath, 'utils'),
    exportDefault: false,
  },
  {
    folderPath: path.resolve(paths.serverPath, 'serverUtils'),
    exportDefault: false,
  },
  {
    folderPath: path.resolve(paths.sourcePath, 'api'),
    exportDefault: false,
  },
  {
    folderPath: path.resolve(paths.sourcePath, 'models'),
    exportDefault: false,
  },
  {
    folderPath: path.resolve(paths.sourcePath, 'pages'),
    exportDefault: false,
  },
  {
    folderPath: path.resolve(paths.sourcePath, 'actions/general'),
    exportDefault: false,
  },
  {
    folderPath: path.resolve(paths.serverPath, 'routeControllers'),
    exportDefault: false,
  },
  {
    folderPath: path.resolve(paths.validatorsPath, 'api'),
    exportDefault: true,
  },
];
paths.generateAssetsExportFilesConfig = [
  {
    folderPath: path.resolve(paths.assetsPath, 'icons'),
    exportDefault: false,
  },
  {
    folderPath: path.resolve(paths.assetsPath, 'images'),
    exportDefault: true,
  },
];

export { paths };
