import { makeAutoObservable } from 'mobx';

import { authFormConfig } from 'formConfigs';

class StoreUser {
  constructor() {
    makeAutoObservable(this);
  }

  name = '';
  email = '';
  sessionExpires = 0;
  authFormConfig = authFormConfig;

  get isLoggedIn() {
    return Boolean(this.email);
  }
}

export const user = new StoreUser();
