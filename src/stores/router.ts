import { makeAutoObservable } from 'mobx';

import { RouteType, routes } from 'routes';

type MetaDataType = { title?: string; description?: string };

class StoreRouter {
  constructor() {
    makeAutoObservable(this);
  }

  currentRoute: RouteType<keyof typeof routes> = null;
  metaData: MetaDataType = {};
}

export const router = new StoreRouter();
