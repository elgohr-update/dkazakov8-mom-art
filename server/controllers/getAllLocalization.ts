import { db } from 'Server/db';
import { isLoggedIn } from 'Server/utils';

export function getAllLocalization({ req }) {
  return Promise.resolve()
    .then(() => isLoggedIn({ req }))
    .then(db.getLocalization)
    .then(translationsObject => ({ translations: translationsObject }));
}
