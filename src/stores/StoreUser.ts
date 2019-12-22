import { makeObservable } from 'utils';

@makeObservable
export class StoreUser {
  name = '';
  email = '';
  sessionExpires = 0;
  authForm = {};

  get isLoggedIn() {
    return Boolean(this.email);
  }
}
