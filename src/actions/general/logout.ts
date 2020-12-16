import { TypeAction } from 'models';

export const logout: TypeAction = ({ actions, api }) =>
  /**
   * Lazy developer... you'd better create store.actions.general.restoreInitialState() method
   * with redirect to root page and clearing all private data & cookies & local storage.
   *
   */

  api.logout().then(() =>
    actions.general.setUserData({
      email: '',
      sessionExpires: 0,
    })
  );
