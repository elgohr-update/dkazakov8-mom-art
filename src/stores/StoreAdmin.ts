import { makeObservable } from 'utils';
import { MessageObjectType } from 'common';

@makeObservable
export class StoreAdmin {
  translations: { [key: string]: MessageObjectType } = {};
  form = {};
}
