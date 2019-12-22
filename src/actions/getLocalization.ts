import { ActionFirstParams } from 'commonUnsafe';

export function getLocalization({ store }: ActionFirstParams, { language }) {
  return store.actions.api
    .getLocalization({ language })
    .then(({ translations }) =>
      store.actions.common.getLocalizationSuccess({ language, translations })
    );
}

export function getLocalizationSuccess({ store }: ActionFirstParams, { language, translations }) {
  store.ui.currentLanguage = language;
  store.ui.lnData = translations;

  if (IS_CLIENT) {
    const newPathname = location.pathname.replace(/.+\//, `/${language}/`);

    // Change URL without page reloading
    window.history.pushState(null, null, newPathname);
  }

  return Promise.resolve();
}
