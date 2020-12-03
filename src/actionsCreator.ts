import _ from 'lodash';
import { action, observable, runInAction } from 'mobx';

import * as apiRaw from 'api';
import { Express } from 'common';
import { actions } from 'actions';
import { StoreRoot } from 'stores/StoreRoot';
import { TypeGlobals } from 'models';

export function actionsCreator(
  store: StoreRoot,
  req?: Express['Request'],
  res?: Express['Response']
): Omit<TypeGlobals, 'store' | 'getters'> {
  // @ts-ignore
  const connectedActions: TypeGlobals['actions'] & {
    api: TypeGlobals['api'];
  } = {
    ..._.mapValues(actions, actionGroup => {
      return _.mapValues(actionGroup, fn => {
        const fnAction = action(fn);

        function wrapperAction(params) {
          runInAction(() => (wrapperAction.data.isExecuting = true));

          return fnAction(
            // @ts-ignore
            {
              api: connectedActions.api,
              store,
              actions: connectedActions,
            },
            params
          ).then(data => {
            runInAction(() => (wrapperAction.data.isExecuting = false));

            return data;
          });
        }

        wrapperAction.data = observable({ isExecuting: false });

        return wrapperAction;
      });
    }),
    // @ts-ignore
    api: _.mapValues(apiRaw, (route, apiName) => {
      function wrapperAction(params) {
        runInAction(() => (wrapperAction.data.isExecuting = true));

        return connectedActions.general
          .request({ req, res, route, ...Object.assign({ apiName }, params) })
          .then(data => {
            runInAction(() => (wrapperAction.data.isExecuting = false));

            return data;
          });
      }

      wrapperAction.data = observable({ isExecuting: false });

      return wrapperAction;
    }),
  };

  return {
    api: connectedActions.api,
    actions: connectedActions,
  };
}
