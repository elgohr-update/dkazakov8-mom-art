import { ActionFirstParams } from 'models';
import { setLanguageToSession } from 'utils';

export function onStoreInitializedServer({ store }: ActionFirstParams, { req, res }) {
  return Promise.resolve()
    .then(() => setLanguageToSession({ req, store }))
    .then(() =>
      store.actions.common.setTheme({ theme: req.session.theme || store.ui.themesList[0] })
    )
    .then(() => store.actions.common.getLocalization({ language: req.session.language }))
    .then(() =>
      store.actions.common.setUserData({
        email: req.session.email || '',
        sessionExpires: req.session.cookie.expires.getTime(),
      })
    )
    .then(() => store.actions.common.redirectTo({ req, res }));
}
