import _ from 'lodash';
import React from 'react';
import { observable, action } from 'mobx';

import { getLn } from 'utils';
import { messages } from 'utils/messages';
import { SkipFirstArgType, Express } from 'common';
import * as api from 'api';
import * as actions from 'actions';

import { StoreUi } from './StoreUi';
import { StoreUser } from './StoreUser';
import { StoreAdmin } from './StoreAdmin';
import { StoreRouter } from './StoreRouter';
import { StoreGallery } from './StoreGallery';

export type StoreConstructorParams = { req?: Express['Request']; res?: Express['Response'] };

type Actions = {
  api: {
    [FnName in keyof typeof api]: (
      ...args: Array<typeof api[FnName]['params']>
    ) => Promise<typeof api[FnName]['response']>;
  };
  common: {
    [FnName in keyof typeof actions]: SkipFirstArgType<typeof actions[FnName]>;
  };
};

type Executions = {
  api: {
    [FnName in keyof typeof api]: boolean;
  };
  common: {
    [FnName in keyof typeof actions]: boolean;
  };
};

export class StoreRoot {
  actions: Actions;
  executions: Executions;

  ui: StoreUi;
  user: StoreUser;
  admin: StoreAdmin;
  router: StoreRouter;
  gallery: StoreGallery;

  getLn: SkipFirstArgType<typeof getLn>;
  getters: Record<string, any>;

  constructor(params: StoreConstructorParams) {
    const store = this;

    store.executions = {
      common: observable(_.mapValues(actions, _.stubFalse)),
      api: observable(_.mapValues(api, _.stubFalse)),
    };

    const mobxActions = _.mapValues(actions, fn => action(fn));

    store.actions = {
      // @ts-ignore
      common: _.mapValues(mobxActions, (fn, fnName) => (...args: any[]) =>
        Promise.resolve()
          .then(() => (store.executions.common[fnName] = true))
          // @ts-ignore
          .then(() => fn({ store, ...params }, ...args))
          .then((data: ReturnType<typeof fn>) => {
            store.executions.common[fnName] = false;
            return data;
          })
      ),
      api: _.mapValues(api, (apiConfig, apiName) => (requestParams: any) =>
        Promise.resolve()
          .then(() => (store.executions.api[apiName] = true))
          .then(() => store.actions.common.request(apiConfig, requestParams))
          .then(data => {
            store.executions.api[apiName] = false;
            return data;
          })
      ),
    };

    store.ui = new StoreUi();
    store.user = new StoreUser();
    store.admin = new StoreAdmin();
    store.router = new StoreRouter();
    store.gallery = new StoreGallery();

    store.getLn = getLn.bind(null, { store });

    store.getters = observable({
      get pageTitle() {
        const { title = '' } = store.router.metaData;

        if (!title) {
          return store.getLn(messages.pageTitleSuffix);
        }

        return `${title} - ${store.getLn(messages.pageTitleSuffix)}`;
      },
    });
  }
}

export const StoreContext = React.createContext<{ store: StoreRoot }>(undefined);
StoreContext.displayName = 'StoreContext';
