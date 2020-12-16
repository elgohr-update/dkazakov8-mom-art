import _ from 'lodash';
import { action, observable, runInAction } from 'mobx';

import * as apiRaw from 'api';
import { Express } from 'common';
import { actions } from 'actions';
import { TypeGlobals, TypeStore } from 'models';

export function actionsCreator(
  store: TypeStore,
  req?: Express['Request'],
  res?: Express['Response']
): Omit<TypeGlobals, 'store' | 'getters'> {
  function createWrappedAction(allActions, fn) {
    function wrapperAction(params) {
      runInAction(() => (wrapperAction.data.isExecuting = true));

      return fn(
        {
          api: allActions.api,
          store,
          actions: allActions,
          extendActions,
        },
        params
      ).then(data => {
        runInAction(() => (wrapperAction.data.isExecuting = false));

        return data;
      });
    }

    wrapperAction.data = observable({ isExecuting: false });

    return wrapperAction;
  }

  // @ts-ignore
  const connectedActions: TypeGlobals['actions'] & {
    api: TypeGlobals['api'];
  } = {
    ..._.mapValues(actions, actionGroup =>
      _.mapValues(actionGroup, fn => {
        const fnAction = action(fn);

        function wrapperAction(params) {
          runInAction(() => (wrapperAction.data.isExecuting = true));

          return fnAction(
            // @ts-ignore
            {
              api: connectedActions.api,
              store,
              actions: connectedActions,
              extendActions,
            },
            params
          ).then(data => {
            runInAction(() => (wrapperAction.data.isExecuting = false));

            return data;
          });
        }

        wrapperAction.data = observable({ isExecuting: false });

        return wrapperAction;
      })
    ),
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

  function extendActions(modularActions: TypeGlobals['actions'], noWrapping: boolean) {
    if (noWrapping) {
      Object.assign(connectedActions, modularActions);

      return;
    }

    Object.entries(modularActions).forEach(([actionGroupName, actionGroup]) => {
      if (!connectedActions[actionGroupName]) connectedActions[actionGroupName] = {};

      Object.entries(actionGroup).forEach(([actionName, fn]) => {
        if (!connectedActions[actionGroupName][actionName]) {
          connectedActions[actionGroupName][actionName] = createWrappedAction(
            connectedActions,
            action(fn)
          );
        }
      });
    });
  }

  return {
    api: connectedActions.api,
    actions: connectedActions,
    extendActions,
  };
}
