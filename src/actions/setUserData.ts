import { ActionFirstParams } from 'models';

export function setUserData({ store }: ActionFirstParams, { email, sessionExpires }) {
  store.user.email = email;
  store.user.sessionExpires = sessionExpires;

  return Promise.resolve();
}
