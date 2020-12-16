import { isLoggedIn } from 'Server/utils';

import { db } from 'Server/db';

export function getAllLocalization({ req }) {
  return Promise.resolve()
    .then(() => isLoggedIn({ req }))
    .then(db.getLocalization)
    .then(translationsObject => ({ translations: translationsObject }));
}
