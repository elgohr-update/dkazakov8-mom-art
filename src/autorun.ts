import { reaction } from 'mobx';

import { TypeGlobals } from 'models';

function setBodyClassOnModal({ store }: TypeGlobals) {
  const elBody = document.body;

  reaction(
    () => store.ui.modalIsOpen,
    () => {
      elBody.classList[store.ui.modalIsOpen ? 'add' : 'remove']('modalOpened');
    }
  );
}

function refreshRoute({ store, actions }: TypeGlobals) {
  /**
   * Refresh route on language change for updating page title
   *
   */

  reaction(
    () => store.ui.currentLanguage,
    () => actions.general.redirectTo({})
  );
}

function setPageTitle({ getters }: TypeGlobals) {
  /**
   * On route change we only need to update page title, not all meta-tags
   *
   */

  reaction(
    () => getters.pageTitle,
    () => (document.title = getters.pageTitle)
  );
}

export function initAutorun(params: TypeGlobals) {
  [refreshRoute, setPageTitle, setBodyClassOnModal].forEach(reactionFn => reactionFn(params));
}
