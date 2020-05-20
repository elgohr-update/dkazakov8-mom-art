import { ActionFirstParams } from 'models';

export function setScreenSize({ store }: ActionFirstParams) {
  const root = document.documentElement;

  store.ui.screen.width = root.clientWidth;
  store.ui.screen.height = root.clientHeight;

  return Promise.resolve();
}
