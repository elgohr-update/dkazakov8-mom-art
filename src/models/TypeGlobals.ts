import { TypeApi } from 'models/TypeApi';
import { TypeStore } from 'models/TypeStore';
import { TypeActions } from 'models/TypeAction';
import { StoreGetters } from 'getters';

export type TypeGlobals = {
  api: TypeApi;
  store: TypeStore;
  actions: TypeActions;
  getters: StoreGetters;
  extendActions: (modularActions: any, noWrapping?: boolean) => void;
};
