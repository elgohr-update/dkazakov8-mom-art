import { reaction } from 'mobx';

import { StoreRoot } from 'stores/StoreRoot';

function refreshRoute(store: StoreRoot) {
  /**
   * Refresh route on language change for updating page title
   *
   */

  reaction(
    () => store.ui.currentLanguage,
    () => store.actions.common.redirectTo({})
  );
}

function setPageTitle(store: StoreRoot) {
  /**
   * On route change we only need to update page title, not all meta-tags
   *
   */

  reaction(
    () => store.getters.pageTitle,
    () => (document.title = store.getters.pageTitle)
  );
}

export function initAutorun(store: StoreRoot) {
  [refreshRoute, setPageTitle].forEach(reactionFn => reactionFn(store));
}
