import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import chalk from 'chalk';
import { ESLint } from 'eslint';

import { env } from '../../env';
import {
  paths,
  TypeReexportConfig,
  TypeValidatorsConfig,
  TypeExportObjectConfig,
} from '../../paths';
import eslintConfig from '../../eslint.config';
import { Compiler } from '../../lib/ts-interface-builder';

const eslint = new ESLint({
  fix: true,
  extensions: ['.js', '.ts', '.tsx'],
  overrideConfigFile: path.resolve(paths.root, 'eslint.config.js'),
});

const logsPrefix = chalk.blue(`[WEBPACK]`);

// @ts-ignore
// eslint-disable-next-line prefer-destructuring
const { tabWidth } = eslintConfig.rules['prettier/prettier'][1];

type TypeProcessParams<T> = { changedFiles?: string[]; rebuildAll: boolean; configRaw: T };

function getReexportFileName(folderName: string) {
  return `_${folderName}.ts`;
}

function filterFileNames(filesNames, folderName: string) {
  const skipFilesArray = ['package.json', 'messages.ts', getReexportFileName(folderName)];

  return filesNames.filter(fileName => !skipFilesArray.some(fName => fileName.includes(fName)));
}

function getFilteredChildren(folderPath: string) {
  const { base: folderName } = path.parse(folderPath);

  const childrenFileNames = fs.readdirSync(folderPath);
  const filteredChildrenFileNames = filterFileNames(childrenFileNames, folderName);

  return {
    paths: filteredChildrenFileNames.map(fileName => path.resolve(folderPath, fileName)),
    names: filteredChildrenFileNames,
  };
}

function createPackageFile(folderPath: string) {
  const packagePath = path.resolve(folderPath, 'package.json');

  if (!fs.existsSync(packagePath)) {
    const { base: folderName } = path.parse(folderPath);
    const reexportFileName = getReexportFileName(folderName);

    return fs.promises.writeFile(
      packagePath,
      `{
  "main": "${reexportFileName}",
  "types": "${reexportFileName}"
}
`
    );
  }

  return Promise.resolve();
}

class GenerateFiles {
  _saveFile(params: { content?: string; filePath: string; noEslint?: boolean }) {
    const { content, filePath, noEslint } = params;

    if (content == null) return false;

    const oldFileContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';

    return Promise.resolve()
      .then(() => (noEslint ? content : this._formatTextWithEslint(content)))
      .then(formattedNewContent => {
        if (oldFileContent === formattedNewContent) return false;

        return fs.promises.writeFile(filePath, formattedNewContent, 'utf8').then(() => {
          if (env.LOGS_GENERATE_FILES) console.log(`${logsPrefix} Changed: ${filePath}`);

          return true;
        });
      });
  }

  _objToString(obj: Record<string, any>) {
    // Format like Prettier instead of calling _formatTextWithEslint to save some time
    return `{\n${_.entries(obj)
      .map(pair => `${_.repeat(' ', tabWidth)}${pair.join(': ')}`)
      .join(',\n')},\n};\n`;
  }

  _formatTextWithEslint(str: string) {
    return eslint.lintText(str).then(data => data[0].output || str);
  }

  _createExportObjectFromFilesArray(params: {
    folderName: string;
    filesNames: string[];
    exportDefault: boolean;
  }) {
    const { folderName, filesNames, exportDefault } = params;

    return filesNames.reduce((exportObject, fileName) => {
      const { name: fileNameNoExt } = path.parse(fileName);

      const paramName = _.camelCase(fileNameNoExt);
      let paramValue = `require('./${folderName}/${fileName}')`;
      paramValue = exportDefault ? `${paramValue}.default` : paramValue;

      return { ...exportObject, [paramName]: paramValue };
    }, {});
  }

  generateExportFiles(params: TypeProcessParams<TypeReexportConfig>): Promise<boolean> {
    const { configRaw, rebuildAll, changedFiles } = params;

    let configFiltered = configRaw;

    if (!rebuildAll) {
      configFiltered = configFiltered.filter(({ folderPath }) =>
        changedFiles.some(filePath => filePath.includes(folderPath))
      );
    }

    return Promise.all(
      configFiltered.map(({ folderPath, exportDefault }) => {
        const { base: folderName } = path.parse(folderPath);

        const childrenNames = getFilteredChildren(folderPath).names;
        const content = childrenNames.reduce((template, fileName) => {
          const { name: fileNameNoExt } = path.parse(fileName);

          return exportDefault
            ? `${template}export { default as ${fileNameNoExt} } from './${fileNameNoExt}';\n`
            : `${template}export * from './${fileNameNoExt}';\n`;
        }, '// This file is auto-generated\n\n');

        return Promise.resolve()
          .then(() => createPackageFile(folderPath))
          .then(() =>
            this._saveFile({
              content,
              filePath: path.resolve(folderPath, getReexportFileName(folderName)),
              noEslint: true,
            })
          );
      })
    ).then(filesSavedMarks => filesSavedMarks.some(Boolean));
  }

  generateValidationFiles(params: TypeProcessParams<TypeValidatorsConfig>): Promise<boolean> {
    const { configRaw, rebuildAll, changedFiles } = params;

    let configFiltered = configRaw;

    if (!rebuildAll) {
      configFiltered = configFiltered.filter(({ folderPath, triggerPath }) =>
        changedFiles.some(
          filePath => filePath.includes(folderPath) || triggerPath.includes(triggerPath)
        )
      );
    }

    return Promise.all(
      configFiltered.map(({ folderPath, targetFolder }) => {
        const { base: folderName } = path.parse(folderPath);

        const generatedFolderPath = path.resolve(targetFolder, folderName);

        if (!fs.existsSync(generatedFolderPath)) fs.mkdirSync(generatedFolderPath);

        const childrenPaths = getFilteredChildren(folderPath).paths;
        const compilerResults = Compiler.compile(childrenPaths, {
          inlineImports: true,
        });
        const saveFilePromises = compilerResults.map(result =>
          this._saveFile({
            content: result.content,
            filePath: path.resolve(generatedFolderPath, path.parse(result.filePath).base),
          })
        );

        return Promise.all(saveFilePromises).then(filesSavedMarks => filesSavedMarks.some(Boolean));
      })
    ).then(filesSavedMarks => filesSavedMarks.some(Boolean));
  }

  generateAssetsExportFiles(params: TypeProcessParams<TypeExportObjectConfig>): Promise<boolean> {
    const { configRaw, rebuildAll, changedFiles } = params;

    let configFiltered = configRaw;

    if (!rebuildAll) {
      configFiltered = configFiltered.filter(({ folderPath }) =>
        changedFiles.some(filePath => filePath.includes(folderPath))
      );
    }

    return Promise.all(
      configFiltered.map(({ folderPath, exportDefault }) => {
        const { base: folderName, dir: parentPath } = path.parse(folderPath);

        const generatedFileName = `${folderName}.ts`;
        const generatedFilePath = path.resolve(parentPath, generatedFileName);
        const childrenNames = getFilteredChildren(folderPath).names;
        const exportObject = this._createExportObjectFromFilesArray({
          folderName,
          filesNames: childrenNames,
          exportDefault,
        });
        const content = `// This file is auto-generated\n\nexport const ${folderName} = ${this._objToString(
          exportObject
        )}`;

        return this._saveFile({
          content,
          filePath: generatedFilePath,
          noEslint: true,
        });
      })
    ).then(filesSavedMarks => filesSavedMarks.some(Boolean));
  }

  process({ changedFiles }: { changedFiles?: string[] }) {
    const startTime = Date.now();
    const isFirstGeneration = changedFiles == null;
    let filesChanged = false;

    // Order matters
    return Promise.resolve()
      .then(() =>
        this.generateValidationFiles({
          configRaw: paths.generateValidationsConfig,
          rebuildAll: isFirstGeneration,
          changedFiles,
        })
      )
      .then(changedMark => changedMark && (filesChanged = true))

      .then(() =>
        this.generateExportFiles({
          configRaw: paths.generateExportFilesConfig,
          rebuildAll: isFirstGeneration,
          changedFiles,
        })
      )
      .then(changedMark => changedMark && (filesChanged = true))

      .then(() =>
        this.generateAssetsExportFiles({
          changedFiles,
          configRaw: paths.generateAssetsExportFilesConfig,
          rebuildAll: isFirstGeneration,
        })
      )
      .then(changedMark => changedMark && (filesChanged = true))

      .then(() => {
        if (isFirstGeneration || filesChanged) {
          const endTime = Date.now();

          console.log(
            '%s Finished generating files within %s seconds',
            logsPrefix,
            chalk.blue(String((endTime - startTime) / 1000))
          );
        }

        return filesChanged;
      });
  }
}

export const generateFiles = new GenerateFiles();
