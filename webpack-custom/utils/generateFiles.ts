import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import ts from 'typescript';
import chalk from 'chalk';
// @ts-ignore
import { ESLint } from 'eslint';

import { Compiler } from '../../lib/ts-interface-builder';
import { paths } from '../../paths';
import { env } from '../../env';

const eslint = new ESLint({
  fix: true,
  extensions: ['.js', '.ts', '.tsx'],
  overrideConfigFile: path.resolve(paths.rootPath, 'eslint.config.js'),
});

const logsPrefix = '[GenerateFiles]';

const modelsPath = path.resolve(paths.sourcePath, 'models');
const pathsForGenerateValidationFiles = [path.resolve(paths.sourcePath, 'api')];
const pathsForgenerateExportFiles = [
  path.resolve(paths.sourcePath, 'api'),
  path.resolve(paths.sourcePath, 'const'),
  path.resolve(paths.sourcePath, 'utils'),
  path.resolve(paths.sourcePath, 'pages'),
  path.resolve(paths.sourcePath, 'models'),
  path.resolve(paths.sourcePath, 'actions'),
  path.resolve(paths.validatorsPath, 'api'),
  path.resolve(paths.serverPath, 'serverUtils'),
  path.resolve(paths.serverPath, 'routeControllers'),
];

function reportDiagnostics(diagnostics: ts.Diagnostic[]): void {
  diagnostics.forEach(diagnostic => {
    let message = 'Error';
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      message += ` ${diagnostic.file.fileName} (${line + 1},${character + 1})`;
    }
    message += `: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`;
    console.log(message);
  });
}

function readConfigFile(configFileName: string) {
  const configFileText = fs.readFileSync(configFileName, 'utf-8');

  // Parse JSON, after removing comments. Just fancier JSON.parse
  const result = ts.parseConfigFileTextToJson(configFileName, configFileText);
  const configObject = result.config;

  return ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(configFileName));
}

class GenerateFiles {
  _removeFileExtension(str: string) {
    return str.replace(/\.[^/.]+$/, '');
  }

  _objToString(obj: Record<string, any>) {
    return `{\n${_.entries(obj)
      .map(pair => `  ${pair.join(': ')}`)
      .join(',\n')},\n};\n`;
  }

  _formatTextWithEslint(str: string) {
    return eslint.lintText(str).then(data => data[0].output || str);
  }

  _formatFilesWithEslint(str: string) {
    return eslint.lintFiles(str);
  }

  _saveFile({
    content,
    filePath,
    noEslint,
  }: {
    content?: string;
    filePath: string;
    noEslint?: boolean;
  }) {
    const oldFileContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
    const newContent = content != null ? content : oldFileContent;

    return Promise.resolve()
      .then(() => (noEslint ? Promise.resolve(newContent) : this._formatTextWithEslint(newContent)))
      .then(formattedNewContent => {
        if (oldFileContent === formattedNewContent) return false;

        return fs.promises
          .writeFile(filePath, formattedNewContent, 'utf8')
          .then(() => {
            if (env.LOGS_GENERATE_FILES) console.log(`${logsPrefix} Changed: ${filePath}`);
          })
          .then(() => true);
      });
  }

  generateExportFiles({ changedFiles }: any) {
    const filteredFoldersPaths = pathsForgenerateExportFiles.filter(
      folderPath => !changedFiles || changedFiles.some(fPath => fPath.indexOf(folderPath) !== -1)
    );
    const specialExports = [path.resolve(paths.validatorsPath, 'api')];

    if (filteredFoldersPaths.length === 0) return false;

    return Promise.all(
      filteredFoldersPaths.map(folderPath => {
        const folderName = folderPath.split(path.sep).pop();
        const generatedFileName = `_${folderName}.ts`;
        const generatedFilePath = path.resolve(folderPath, generatedFileName);
        const skipFilesArray = ['package.json', 'messages.ts', generatedFileName];

        return Promise.resolve()
          .then(() => fs.promises.readdir(folderPath))
          .then(filesNames =>
            filesNames.filter(
              fileName => !skipFilesArray.some(testStr => fileName.includes(testStr))
            )
          )
          .then(filesNames =>
            filesNames.reduce((template, fileName) => {
              const fileNameWithoutExtension = fileName.replace(/\.[a-z]+$/, '');

              if (specialExports.indexOf(folderPath) !== -1) {
                return `${template}export { default as ${fileNameWithoutExtension} } from './${fileNameWithoutExtension}';\n`;
              }

              return `${template}export * from './${fileNameWithoutExtension}';\n`;
            }, '// This file is auto-generated\n\n')
          )
          .then(newFileContent =>
            this._saveFile({
              filePath: generatedFilePath,
              content: newFileContent,
              noEslint: true,
            })
          );
      })
    );
  }

  generateValidationFiles({ changedFiles }: any) {
    const filteredFoldersPaths = pathsForGenerateValidationFiles.filter(
      folderPath =>
        !changedFiles ||
        changedFiles.some(
          fPath => fPath.indexOf(folderPath) !== -1 || fPath.indexOf(modelsPath) !== -1
        )
    );

    if (filteredFoldersPaths.length === 0) return false;

    return Promise.all(
      filteredFoldersPaths.map(folderPath => {
        const folderName = folderPath.split(path.sep).pop();
        const generatedFileName = `_${folderName}.ts`;
        const generatedFolderPath = path.resolve(paths.validatorsPath, folderName);

        if (!fs.existsSync(generatedFolderPath)) fs.mkdirSync(generatedFolderPath);

        const skipFilesArray = ['package.json', 'messages.ts', generatedFileName];

        return Promise.resolve()
          .then(() => fs.promises.readdir(folderPath))
          .then(filesNames =>
            filesNames.filter(
              fileName => !skipFilesArray.some(testStr => fileName.includes(testStr))
            )
          )
          .then(filesNames => {
            const filesPaths = filesNames.map(fileName => path.resolve(folderPath, fileName));

            const newContents = Compiler.compile(filesPaths, {
              inlineImports: true,
            });

            return Promise.all(
              newContents.map(({ filePath, content }) => {
                const { base: fileName } = path.parse(filePath);
                const generatedFilePath = path.resolve(generatedFolderPath, fileName);
                return this._saveFile({ filePath: generatedFilePath, content });
              })
            );
          });
      })
    ).then(_.flatten);
  }

  generateAssetsExportFiles({ changedFiles }: any) {
    const configs = [
      {
        folderPath: path.resolve(paths.assetsPath, 'icons'),
        exportDefault: false,
      },
      {
        folderPath: path.resolve(paths.assetsPath, 'images'),
        exportDefault: true,
      },
    ];

    const filteredConfig = configs.filter(
      ({ folderPath }) =>
        !changedFiles || changedFiles.some(fPath => fPath.indexOf(folderPath) !== -1)
    );

    if (filteredConfig.length === 0) return false;

    return Promise.all(
      filteredConfig.map(({ folderPath, exportDefault }) => {
        const pathArray = folderPath.split(path.sep);
        const filesFolder = pathArray.pop();
        const parentPath = pathArray.join(path.sep);
        const filesPath = path.resolve(parentPath, filesFolder);
        const generatedFileName = `${filesFolder}.ts`;
        const generatedFilePath = path.resolve(parentPath, generatedFileName);
        const filesMapper = {};

        return Promise.resolve()
          .then(() => fs.promises.readdir(filesPath))
          .then(filesNames =>
            filesNames.forEach(fileName => {
              const exportKey = _.camelCase(this._removeFileExtension(fileName));
              const exportValue = `require('./${filesFolder}/${fileName}')${
                exportDefault ? '.default' : ''
              }`;

              filesMapper[exportKey] = exportValue;
            })
          )
          .then(
            () =>
              `// This file is auto-generated\n\nexport const ${filesFolder} = ${this._objToString(
                filesMapper
              )}`
          )
          .then(newFileContent =>
            this._saveFile({
              filePath: generatedFilePath,
              content: newFileContent,
              noEslint: true,
            })
          );
      })
    );
  }

  generateSeparatedTypes() {
    const separatedTypesConfig = readConfigFile(
      path.resolve(paths.rootPath, 'tsconfig-store.json')
    );
    const separatedTypesProgram = ts.createProgram(
      separatedTypesConfig.fileNames,
      separatedTypesConfig.options
    );
    const emitResult = separatedTypesProgram.emit();

    reportDiagnostics(
      ts.getPreEmitDiagnostics(separatedTypesProgram).concat(emitResult.diagnostics)
    );

    if (emitResult.emitSkipped) {
      return Promise.reject(new Error('generateSeparatedTypes: compile skipped'));
    }

    return Promise.resolve();

    // return this._formatFilesWithEslint('separated-types').then(data =>
    //   Promise.all(
    //     data.map(fileData => fs.promises.writeFile(fileData.filePath, fileData.output, 'utf8'))
    //   )
    // );
  }

  process({ changedFiles }: any) {
    const startTime = Date.now();
    let filesChanged = false;

    function setFilesChanged(fChanged) {
      const changed = _.isArray(fChanged) && fChanged.some(mark => mark === true);

      if (changed) filesChanged = true;
    }

    return Promise.resolve()
      .then((): any => this.generateValidationFiles({ changedFiles }))
      .then(setFilesChanged)
      .then((): any => this.generateAssetsExportFiles({ changedFiles }))
      .then(setFilesChanged)
      .then((): any => this.generateExportFiles({ changedFiles }))
      .then(() => this.generateSeparatedTypes())
      .then(setFilesChanged)
      .then(() => {
        const timeStamp = ` ${chalk.yellow(new Date().toTimeString().split(/ +/)[0])}`;

        console.log(
          '%s Finished generating files within %s seconds',
          chalk.blue(`[WEBPACK${timeStamp}]`),
          chalk.blue(String((Date.now() - startTime) / 1000))
        );

        return filesChanged;
      });
  }
}

export const generateFiles = new GenerateFiles();
