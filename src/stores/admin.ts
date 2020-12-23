import { makeAutoObservable } from 'mobx';

import { MessageObjectType } from 'common';

class StoreAdmin {
  constructor() {
    makeAutoObservable(this);
  }

  translations: { [key: string]: MessageObjectType } = {};
  form = {};
}

export const admin = new StoreAdmin();
