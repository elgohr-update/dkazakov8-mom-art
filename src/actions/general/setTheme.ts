import { runInAction } from 'mobx';

import { themes } from 'const';
import { TypeAction } from 'models';
import { setThemeToHTML } from 'utils';

type Params = { theme: string };

export const setTheme: TypeAction<Params> = ({ store, api }, { theme }) => {
  if (!store.ui.themesList.includes(theme)) return Promise.resolve();

  return api.setTheme({ theme }).then(() => {
    const themeObject = themes[theme];

    runInAction(() => {
      store.ui.currentTheme = theme;
      store.ui.themeParams = themeObject;
    });

    if (IS_CLIENT) setThemeToHTML(themeObject);
  });
};
