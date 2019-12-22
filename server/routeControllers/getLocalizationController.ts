import _ from 'lodash';

import { db } from 'db';

export function getLocalizationController({ req }) {
  const { language } = req.body;

  return Promise.resolve()
    .then(db.getLocalization)
    .then(translationsObject => {
      const translationsByLang = _.mapValues(
        translationsObject,
        messageObject => messageObject[language] || 'EMPTY'
      );

      req.session.language = language;

      return { translations: translationsByLang };
    });
}
