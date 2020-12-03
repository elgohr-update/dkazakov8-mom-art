import { Express } from 'common';
import { TypeAction } from 'models';
import { setLanguageToSession } from 'utils';

type Params = { req?: Express['Request']; res?: Express['Response'] };

export const onStoreInitializedServer: TypeAction<Params> = ({ store, actions }, { req, res }) => {
  return Promise.resolve()
    .then(() => setLanguageToSession({ req, store }))
    .then(() => actions.general.setTheme({ theme: req.session.theme || store.ui.themesList[0] }))
    .then(() => actions.general.getLocalization({ language: req.session.language }))
    .then(() =>
      actions.general.setUserData({
        email: req.session.email || '',
        sessionExpires: req.session.cookie.expires.getTime(),
      })
    )
    .then(() => actions.general.redirectTo({ req, res }));
};
