import path from 'path';

const root = __dirname;

export const paths = {
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
  themesObject: path.resolve(root, 'src/const/themes.tsx'),
};

export const generatorConfigs: {
  theme: Array<{ filePath: string; targetFile: string }>;
  validation: Array<{
    folderPath: string;
    triggerPath: string;
    targetFolder: string;
  }>;
  reexport: Array<{ folderPath: string; exportDefault?: boolean }>;
  reexportAssets: Array<{ folderPath: string; exportDefault?: boolean }>;
} = {
  validation: [
    {
      folderPath: path.resolve(paths.source, 'api'),
      triggerPath: path.resolve(paths.source, 'models'),
      targetFolder: paths.validators,
    },
  ],
  reexport: [
    { folderPath: path.resolve(paths.source, 'formConfigs') },
    { folderPath: path.resolve(paths.source, 'const') },
    { folderPath: path.resolve(paths.source, 'utils') },
    { folderPath: path.resolve(paths.server, 'utils') },
    { folderPath: path.resolve(paths.source, 'api') },
    { folderPath: path.resolve(paths.source, 'models') },
    { folderPath: path.resolve(paths.source, 'actions/general') },
    { folderPath: path.resolve(paths.source, 'pages/gallery/stores') },
    { folderPath: path.resolve(paths.source, 'pages/gallery/actions') },
    { folderPath: path.resolve(paths.server, 'controllers') },
    { folderPath: path.resolve(paths.validators, 'api'), exportDefault: true },
  ],
  reexportAssets: [
    { folderPath: path.resolve(paths.assets, 'icons') },
    { folderPath: path.resolve(paths.assets, 'images'), exportDefault: true },
  ],
  theme: [{ filePath: paths.themes, targetFile: paths.themesObject }],
};
