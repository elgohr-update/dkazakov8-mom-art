import { db } from 'db';
import { isLoggedIn } from 'serverUtils';

export function getAllLocalizationController({ req }) {
  return Promise.resolve()
    .then(() => isLoggedIn({ req }))
    .then(db.getLocalization)
    .then(translationsObject => ({ translations: translationsObject }));
}
