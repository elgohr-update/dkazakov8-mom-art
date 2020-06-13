import { makeAutoObservable } from 'mobx';

import { messages } from 'utils/messages';
import { StoreRoot } from 'stores/StoreRoot';

export class StoreGetters {
  constructor(private store: StoreRoot) {
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
