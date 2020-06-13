import { TypeAction } from 'models';

type Params = { email: string; sessionExpires: number };

export const setUserData: TypeAction<Params> = ({ store }, { email, sessionExpires }) => {
  store.user.email = email;
  store.user.sessionExpires = sessionExpires;

  return Promise.resolve();
};
