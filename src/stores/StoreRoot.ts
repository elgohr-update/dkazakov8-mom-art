import { getLn, mergeObservableDeep, unescapeAllStrings } from 'utils';
import { SkipFirstArgType } from 'common';

import { StoreUi } from './StoreUi';
import { StoreUser } from './StoreUser';
import { StoreAdmin } from './StoreAdmin';
import { StoreRouter } from './StoreRouter';

export class StoreRoot {
  // Sometimes we need to get texts in stores or actions, so React component is not a way
  getLn: SkipFirstArgType<typeof getLn>;

  // Dynamic stores are in models/TypeStore

  constructor(
    // Common stores
    public ui = new StoreUi(),
    public user = new StoreUser(),
    public admin = new StoreAdmin(),
    public router = new StoreRouter()
  ) {
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
        this[storeName] = storeInstance;

        if (IS_CLIENT && window.INITIAL_DATA[storeName]) {
          mergeObservableDeep(this[storeName], unescapeAllStrings(window.INITIAL_DATA[storeName]));
        }
      }
    });
  };
}
