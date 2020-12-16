import { toJS } from 'mobx';

import { TypeAction } from 'models';
import { unescapeAllStrings, printMeasures, mergeObservableDeep } from 'utils';

export const onStoreInitializedClient: TypeAction = ({ store, actions }) =>
  /**
   * Here clear store is overwritten by values from backend
   * & fill store with client-specific values
   * & set client-specific listeners
   *
   * So sure that initial hydration will not require unnecessary renders,
   * just those that dependent on browser (like screen inner width)
   *
   */

  Promise.resolve()
    .then(() => mergeObservableDeep(store, unescapeAllStrings(window.INITIAL_DATA)))
    .then(() => console.js(store))
    .then(() => actions.general.setScreenSize())
    .then(() => actions.general.setScreenSize())
    .then(() => {
      window.addEventListener('popstate', () => actions.general.redirectTo({}));
      window.addEventListener('resize', () => actions.general.setScreenSize());
      window.addEventListener('load', function onLoad() {
        const currentRoute = toJS(store.router.currentRoute);

        printMeasures({ currentRoute });

        store.ui.firstRendered = true;
      });
    });
