import { makeAutoObservable } from 'mobx';

import { MessageObjectType } from 'common';

export class StoreAdmin {
  constructor() {
    makeAutoObservable(this);
  }

  translations: { [key: string]: MessageObjectType } = {};
  form = {};
}
