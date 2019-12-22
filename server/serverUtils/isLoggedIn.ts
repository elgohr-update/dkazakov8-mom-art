import { createError } from 'utils/createError';
import { errorsNames } from 'const/errorsNames';

export function isLoggedIn({ req }) {
  if (!req.session.email) {
    throw createError(errorsNames.NOT_ALLOWED, `isLoggedIn middleware [${req.originalUrl}]`);
  }
}
