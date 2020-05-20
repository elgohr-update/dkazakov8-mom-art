import { makeObservable } from 'utils';
import { RouteType } from 'models';

type MetaDataType = { title?: string; description?: string };

@makeObservable
export class StoreRouter {
  currentRoute: RouteType = null;
  metaData: MetaDataType = {};
}
