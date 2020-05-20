import { toJS } from 'mobx';

import { ActionFirstParams } from 'models';
import { unescapeAllStrings, printMeasures, mergeObservableDeep } from 'utils';

export function onStoreInitializedClient({ store }: ActionFirstParams) {
  /**
   * Here clear store is overwritten by values from backend
   * & fill store with client-specific values
   * & set client-specific listeners
   *
   * So sure that initial hydration will not require unnecessary renders,
   * just those that dependent on browser (like screen inner width)
   *
   */

  return Promise.resolve()
    .then(() => mergeObservableDeep(store, unescapeAllStrings(window.INITIAL_DATA)))
    .then(() => store.actions.common.setScreenSize())
    .then(() => {
      window.addEventListener('popstate', () => store.actions.common.redirectTo({}));
      window.addEventListener('resize', () => store.actions.common.setScreenSize());
      window.addEventListener('load', function onLoad() {
        const currentRoute = toJS(store.router.currentRoute);

        printMeasures({ currentRoute });
      });
    });
}
