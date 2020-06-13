import { TypeAction } from 'models';

type Params = { isOpen?: boolean };

export const headerToggleMobileMenu: TypeAction<Params> = ({ store }, { isOpen }) => {
  if (typeof isOpen !== 'undefined') {
    store.ui.headerMenuOpened = isOpen;
  } else {
    store.ui.headerMenuOpened = !store.ui.headerMenuOpened;
  }

  return Promise.resolve();
};
