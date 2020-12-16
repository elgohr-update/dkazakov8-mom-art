import { TypeApi } from 'models/TypeApi';
import { TypeStore } from 'models/TypeStore';
import { TypeActions } from 'models/TypeAction';
import { StoreGetters } from 'stores/StoreGetters';

export type TypeGlobals = {
  api: TypeApi;
  store: TypeStore;
  actions: TypeActions;
  getters: StoreGetters;
  extendActions: (modularActions: any, noWrapping?: boolean) => void;
};
