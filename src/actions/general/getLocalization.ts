import { TypeAction } from 'models';

type Params = { language: 'ru' | 'en' };

export const getLocalization: TypeAction<Params> = ({ api, actions }, { language }) => {
  return api
    .getLocalization({ language })
    .then(({ translations }) => actions.general.getLocalizationSuccess({ language, translations }));
};

type ParamsSuccess = { language: 'ru' | 'en'; translations: any };

export const getLocalizationSuccess: TypeAction<ParamsSuccess> = (
  { store },
  { language, translations }
) => {
  store.ui.currentLanguage = language;
  store.ui.lnData = translations;

  if (IS_CLIENT) {
    const newPathname = location.pathname.replace(/.+\//, `/${language}/`);

    // Change URL without page reloading
    window.history.pushState(null, null, newPathname);
  }

  return Promise.resolve();
};
