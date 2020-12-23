import { errorsNames } from 'const';
import { Express } from 'common';
import { TypeStore } from 'models';

import { createError } from './createError';

export function setLanguageToSession(params: { req: Express['Request']; store: TypeStore }) {
  const { req, store } = params;

  /**
   * Strategy:
   * - First request from user (empty sessionLang):
   * -- No correct URLLang? Redirect to URL with browserLang
   * -- Has correct URLLang? Set sessionLang to it
   *
   * - Second request from user (filled sessionLang):
   * -- No correct URLLang? Redirect to URL with sessionLang
   * -- Has correct URLLang? Set sessionLang to it
   *
   * This strategy means that user could change website's language manually
   * by changing URL like a hacker, of course if we have such language.
   *
   * Alternative strategy may forcefully redirect user to his sessionLang, not allowing
   * to control it by changing URL.
   *
   */

  // eslint-disable-next-line prefer-destructuring
  const URLLang = req.originalUrl.split('/')[1];
  const sessionLang = req.session.language;
  const browserLang = req.acceptsLanguages(...store.ui.languagesList) || store.ui.languagesList[0];

  if (!store.ui.languagesList.includes(URLLang)) {
    const pathnameWithBrowserLang = `/${sessionLang || browserLang}${req.originalUrl}`;

    return Promise.reject(createError(errorsNames.REDIRECT, pathnameWithBrowserLang));
  }

  req.session.language = URLLang as 'ru' | 'en';

  return Promise.resolve();
}
