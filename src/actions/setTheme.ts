import { setThemeToHTML } from 'utils';
import { ActionFirstParams } from 'commonUnsafe';
import themes from 'styles/themes.scss';

export function setTheme({ store }: ActionFirstParams, params: { theme: string }) {
  const { theme } = params;

  if (!store.ui.themesList.includes(theme)) {
    return Promise.resolve();
  }

  return store.actions.api.setTheme({ theme }).then(() => {
    const themeObject = themes[theme];

    store.ui.currentTheme = theme;
    store.ui.themeParams = themeObject;

    if (IS_CLIENT) setThemeToHTML(themeObject);
  });
}
