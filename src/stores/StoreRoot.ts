import { getLn } from 'utils';
import { SkipFirstArgType } from 'common';

import { StoreUi } from './StoreUi';
import { StoreUser } from './StoreUser';
import { StoreAdmin } from './StoreAdmin';
import { StoreRouter } from './StoreRouter';
import { StoreGallery } from './StoreGallery';

export class StoreRoot {
  ui: StoreUi;
  user: StoreUser;
  admin: StoreAdmin;
  router: StoreRouter;
  gallery: StoreGallery;

  getLn: SkipFirstArgType<typeof getLn>;

  constructor() {
    const store = this;

    store.ui = new StoreUi();
    store.user = new StoreUser();
    store.admin = new StoreAdmin();
    store.router = new StoreRouter();
    store.gallery = new StoreGallery();

    store.getLn = getLn.bind(null, { store });
  }
}
