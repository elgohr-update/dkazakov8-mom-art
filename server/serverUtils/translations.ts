import _ from 'lodash';

import { db } from 'db';

/**
 * @docs: https://github.com/expressjs/compression
 *
 */

function getDefaultTranslationsFromFiles(): { [key: string]: { defaultValue: string } } {
  // @ts-ignore
  const context = require.context('../../src', true, /messages\.ts$/);

  const translationsByFiles = {};
  context.keys().forEach(filePath => {
    const { messages } = context(filePath);

    _.values(messages).forEach(({ name, defaultValue }) => {
      translationsByFiles[name] = {
        defaultValue,
      };
    });
  });

  return translationsByFiles;
}

export function updateTranslations() {
  const defaultTranslations = getDefaultTranslationsFromFiles();

  return Promise.resolve()
    .then(db.getLocalization)
    .then(translationsFromDb => {
      // Set new keys & update all default values
      Object.entries(defaultTranslations).forEach(([key, value]) => {
        translationsFromDb[key] = translationsFromDb[key] || value;
        translationsFromDb[key].defaultValue = value.defaultValue;
      });

      // Remove obsolete translations
      Object.keys(translationsFromDb).forEach(key => {
        if (!defaultTranslations[key]) {
          delete translationsFromDb[key];
        }
      });

      // Order by key (forEach is cleaner than reduce)
      const orderedTranslations = {};
      Object.keys(translationsFromDb)
        .sort()
        .forEach(key => (orderedTranslations[key] = translationsFromDb[key]));

      return orderedTranslations;
    })
    .then(db.setLocalization);
}
