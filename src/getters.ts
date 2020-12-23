import { makeAutoObservable } from 'mobx';

import { messages } from 'utils/messages';
import { TypeStore } from 'models';

export class StoreGetters {
  constructor(private store: TypeStore) {
    makeAutoObservable(this);
  }

  get pageTitle() {
    const { title = '' } = this.store.router.metaData;

    if (!title) {
      return this.store.getLn(messages.pageTitleSuffix);
    }

    return `${title} - ${this.store.getLn(messages.pageTitleSuffix)}`;
  }
}
