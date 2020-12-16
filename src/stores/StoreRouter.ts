import { makeAutoObservable } from 'mobx';

import { RouteType, routes } from 'routes';

type MetaDataType = { title?: string; description?: string };

export class StoreRouter {
  constructor() {
    makeAutoObservable(this);
  }

  currentRoute: RouteType<keyof typeof routes> = null;
  metaData: MetaDataType = {};
}
