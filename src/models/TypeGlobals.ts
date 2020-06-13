import { StoreRoot } from 'stores/StoreRoot';
import { StoreGetters } from 'stores/StoreGetters';
import { TypeActions, TypeApi } from 'models';

export type TypeGlobals = {
  api: TypeApi;
  store: StoreRoot;
  actions: TypeActions;
  getters: StoreGetters;
};
