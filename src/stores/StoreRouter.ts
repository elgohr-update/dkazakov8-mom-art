import { makeAutoObservable } from 'mobx';

import { RouteType } from 'models';

type MetaDataType = { title?: string; description?: string };

export class StoreRouter {
  constructor() {
    makeAutoObservable(this);
  }

  currentRoute: RouteType = null;
  metaData: MetaDataType = {};
}
