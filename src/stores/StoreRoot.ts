import { getLn } from 'utils';
import { SkipFirstArgType, PropType } from 'common';

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

  setStores = (store: { [StoreName in keyof StoreRoot]: PropType<StoreRoot, StoreName> }) => {
    Object.entries(store).forEach(([storeName, storeInstance]) => {
      if (!this[storeName]) this[storeName] = storeInstance;
    });
  };
}
