import { ActionFirstParams } from 'models';

export function logout({ store }: ActionFirstParams) {
  /**
   * Lazy developer... you'd better create store.actions.common.restoreInitialState() method
   * with redirect to root page and clearing all private data & cookies & local storage.
   *
   */

  return store.actions.api.logout().then(() =>
    store.actions.common.setUserData({
      email: '',
      sessionExpires: 0,
    })
  );
}
