import { getLn, mergeObservableDeep, unescapeAllStrings } from 'utils';
import { SkipFirstArgType } from 'common';
import * as staticStores from 'stores';

export class StoreRoot {
  // Sometimes we need to get texts in stores or actions, so React component is not a way
  getLn: SkipFirstArgType<typeof getLn>;

  constructor() {
    // Dynamic stores are in models/TypeStore
    Object.assign(this, staticStores);

    this.getLn = getLn.bind(null, { store: this });
  }

  setStores = (store: any) => {
    Object.entries(store).forEach(([storeName, storeInstance]) => {
      /**
       * Client should recreate dynamic stores with initial data passed from server,
       * because SSR does not serialize get() & set() statements
       *
       */

      if (!this[storeName]) {
        const initialData = IS_CLIENT ? window.INITIAL_DATA[storeName] : null;

        this[storeName] = storeInstance;

        if (initialData) mergeObservableDeep(this[storeName], unescapeAllStrings(initialData));
      }
    });
  };
}
