import _ from 'lodash';

import { db } from 'Server/db';
import { isLoggedIn } from 'Server/utils';

export function saveAllLocalization({ req }) {
  const { formData } = req.body;

  return Promise.resolve()
    .then(() => isLoggedIn({ req }))
    .then(db.getLocalization)
    .then(translations => {
      _.entries(formData).forEach(([key, value]) => {
        const keyArr = key.split('-');
        const lang = keyArr.pop();
        const translationName = keyArr.join('-');

        translations[translationName][lang] = value;
      });

      return db.setLocalization(translations);
    })
    .then(() => ({}));
}
