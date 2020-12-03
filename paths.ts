import path from 'path';

export type TypeValidatorsConfig = Array<{
  folderPath: string;
  triggerPath: string;
  targetFolder: string;
}>;
export type TypeReexportConfig = Array<{ folderPath: string; exportDefault?: boolean }>;
export type TypeExportObjectConfig = TypeReexportConfig;

const root = __dirname;

const staticPaths = {
  root,
  env: path.resolve(root, 'env.ts'),
  build: path.resolve(root, 'build'),
  paths: path.resolve(root, 'paths.ts'),
  types: path.resolve(root, '_types'),
  assets: path.resolve(root, 'src/assets'),
  server: path.resolve(root, 'server'),
  source: path.resolve(root, 'src'),
  styles: path.resolve(root, 'src/styles'),
  themes: path.resolve(root, 'src/styles/themes.scss'),
  webpack: path.resolve(root, '_webpack'),
  templates: path.resolve(root, 'templates'),
  validators: path.resolve(root, 'src/validators'),
  nodeModules: path.resolve(root, 'node_modules'),
};

const configPaths: {
  generateValidationsConfig: TypeValidatorsConfig;
  generateExportFilesConfig: TypeReexportConfig;
  generateAssetsExportFilesConfig: TypeExportObjectConfig;
} = {
  generateValidationsConfig: [
    {
      folderPath: path.resolve(staticPaths.source, 'api'),
      triggerPath: path.resolve(staticPaths.source, 'models'),
      targetFolder: staticPaths.validators,
    },
  ],
  generateExportFilesConfig: [
    { folderPath: path.resolve(staticPaths.source, 'formConfigs') },
    { folderPath: path.resolve(staticPaths.source, 'const') },
    { folderPath: path.resolve(staticPaths.source, 'utils') },
    { folderPath: path.resolve(staticPaths.server, 'utils') },
    { folderPath: path.resolve(staticPaths.source, 'api') },
    { folderPath: path.resolve(staticPaths.source, 'models') },
    { folderPath: path.resolve(staticPaths.source, 'pages') },
    { folderPath: path.resolve(staticPaths.source, 'actions/general') },
    { folderPath: path.resolve(staticPaths.server, 'controllers') },
    { folderPath: path.resolve(staticPaths.validators, 'api'), exportDefault: true },
  ],
  generateAssetsExportFilesConfig: [
    { folderPath: path.resolve(staticPaths.assets, 'icons') },
    { folderPath: path.resolve(staticPaths.assets, 'images'), exportDefault: true },
  ],
};

export const paths = Object.assign({}, staticPaths, configPaths);
