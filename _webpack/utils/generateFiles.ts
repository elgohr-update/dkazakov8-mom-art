import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import chalk from 'chalk';
import { ESLint } from 'eslint';

import { env } from '../../env';
import { paths, generatorConfigs } from '../../paths';
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

function saveFile(params: { content?: string; filePath: string; noEslint?: boolean }) {
  const { content, filePath, noEslint } = params;

  if (content == null) return false;

  const oldFileContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';

  return Promise.resolve()
    .then(() => (noEslint ? content : formatTextWithEslint(content)))
    .then(formattedNewContent => {
      if (oldFileContent === formattedNewContent) return false;

      return fs.promises.writeFile(filePath, formattedNewContent, 'utf8').then(() => {
        if (env.LOGS_GENERATE_FILES) console.log(`${logsPrefix} Changed: ${filePath}`);

        return true;
      });
    });
}

function objToString(obj: Record<string, any>) {
  // Format like Prettier instead of calling _formatTextWithEslint to save some time
  return `{\n${_.entries(obj)
    .map(pair => `${_.repeat(' ', tabWidth)}${pair.join(': ')}`)
    .join(',\n')},\n};\n`;
}

function formatTextWithEslint(str: string) {
  return eslint.lintText(str).then(data => data[0].output || str);
}

function createExportObjectFromFilesArray(params: {
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

function convertScssToJsObject(source) {
  const themesObject = {};
  const fullThemesArray = source.match(/\.([^}]|\s)*}/g) || [];

  fullThemesArray.forEach(fullThemeStr => {
    const theme = fullThemeStr.match(/\.\w+\s{/g)[0].replace(/\W/g, '');
    themesObject[theme] = {};

    const variablesMatches = fullThemeStr.match(/--(.*:[^;]*)/g) || [];

    variablesMatches.forEach(varMatch => {
      const [key, value] = varMatch.split(': ');
      themesObject[theme][key] = value;
    });
  });

  return themesObject;
}

function checkThemesEquality(themes) {
  const themesArray = Object.keys(themes);

  themesArray.forEach(themeStr => {
    const themeObject = themes[themeStr];
    const otherThemesArray = themesArray.filter(t => t !== themeStr);

    Object.keys(themeObject).forEach(variableName => {
      otherThemesArray.forEach(otherThemeStr => {
        const otherThemeObject = themes[otherThemeStr];

        if (!otherThemeObject[variableName]) {
          throw new Error(
            `checkThemesEquality: theme ${otherThemeStr} has no variable ${variableName}`
          );
        }
      });
    });
  });
}

function promiseAllOrdered(promiseArray: Array<Promise<any>>) {
  const results = [];

  function executePromise(index: number) {
    if (!promiseArray[index]) return results;

    return promiseArray[index].then(res => {
      results.push(res);

      return executePromise(index + 1);
    });
  }

  return executePromise(0);
}

class GenerateFiles {
  generateReexport(
    params: TypeProcessParams<typeof generatorConfigs['reexport']>
  ): Promise<boolean> {
    const { configRaw, rebuildAll, changedFiles } = params;

    let configFiltered = configRaw;

    if (!rebuildAll) {
      configFiltered = configFiltered.filter(({ folderPath }) =>
        changedFiles.some(filePath => filePath.includes(folderPath))
      );
    }

    return Promise.all(
      configFiltered.map(({ folderPath, exportDefault, exportInnerFolder }) => {
        const { base: folderName } = path.parse(folderPath);

        const childrenNames = getFilteredChildren(folderPath).names;
        const content = childrenNames.reduce((template, fileName) => {
          const { name: fileNameNoExt } = path.parse(fileName);

          const exportModel = exportDefault ? `{ default as ${fileNameNoExt} }` : `*`;
          const exportPathModel = exportInnerFolder
            ? `./${fileNameNoExt}/${exportInnerFolder}`
            : `./${fileNameNoExt}`;

          if (exportInnerFolder && !fs.existsSync(path.resolve(folderPath, exportPathModel)))
            return template;

          return `${template}export ${exportModel} from '${exportPathModel}';\n`;
        }, '// This file is auto-generated\n\n');

        return Promise.resolve()
          .then(() => (exportInnerFolder ? Promise.resolve() : createPackageFile(folderPath)))
          .then(() =>
            saveFile({
              content,
              filePath: path.resolve(
                folderPath,
                exportInnerFolder ? `${exportInnerFolder}.ts` : getReexportFileName(folderName)
              ),
              noEslint: true,
            })
          );
      })
    ).then(filesSavedMarks => filesSavedMarks.some(Boolean));
  }

  generateValidators(
    params: TypeProcessParams<typeof generatorConfigs['validation']>
  ): Promise<boolean> {
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
          saveFile({
            content: result.content,
            filePath: path.resolve(generatedFolderPath, path.parse(result.filePath).base),
          })
        );

        return Promise.all(saveFilePromises).then(filesSavedMarks => filesSavedMarks.some(Boolean));
      })
    ).then(filesSavedMarks => filesSavedMarks.some(Boolean));
  }

  generateReexportAssets(
    params: TypeProcessParams<typeof generatorConfigs['reexportAssets']>
  ): Promise<boolean> {
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
        const exportObject = createExportObjectFromFilesArray({
          folderName,
          filesNames: childrenNames,
          exportDefault,
        });
        const content = `// This file is auto-generated\n\nexport const ${folderName} = ${objToString(
          exportObject
        )}`;

        return saveFile({
          content,
          filePath: generatedFilePath,
          noEslint: true,
        });
      })
    ).then(filesSavedMarks => filesSavedMarks.some(Boolean));
  }

  generateTheme(params: TypeProcessParams<typeof generatorConfigs['theme']>): Promise<boolean> {
    const { configRaw, rebuildAll, changedFiles } = params;

    let configFiltered = configRaw;

    if (!rebuildAll) {
      configFiltered = configFiltered.filter(({ filePath }) =>
        changedFiles.some(fPath => fPath.includes(filePath))
      );
    }

    return Promise.all(
      configFiltered.map(({ filePath, targetFile }) => {
        const { name: targetFileName } = path.parse(targetFile);

        const fileContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';

        const themes = convertScssToJsObject(fileContent);

        checkThemesEquality(themes);

        const content = `// This file is auto-generated\n\nexport const ${targetFileName} = ${JSON.stringify(
          themes
        )}`;

        return saveFile({
          content,
          filePath: targetFile,
        });
      })
    ).then(filesSavedMarks => filesSavedMarks.some(Boolean));
  }

  process({ changedFiles }: { changedFiles?: string[] }) {
    const startTime = Date.now();
    const rebuildAll = changedFiles == null;

    return promiseAllOrdered([
      // Order matters - we need reexport files for new validators
      this.generateValidators({
        configRaw: generatorConfigs.validation,
        rebuildAll,
        changedFiles,
      }),
      this.generateReexport({
        configRaw: generatorConfigs.reexport,
        rebuildAll,
        changedFiles,
      }),
      this.generateReexportAssets({
        configRaw: generatorConfigs.reexportAssets,
        rebuildAll,
        changedFiles,
      }),
      this.generateTheme({
        configRaw: generatorConfigs.theme,
        rebuildAll,
        changedFiles,
      }),
    ]).then(changedMarks => {
      const filesChanged = changedMarks.some(Boolean);

      if (rebuildAll || filesChanged) {
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
