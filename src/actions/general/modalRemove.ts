import { runInAction } from 'mobx';

import { system } from 'const';
import { TypeAction } from 'models';

type Params = { id: string };

export const modalRemove: TypeAction<Params> = ({ store }, { id }) => {
  const { modals } = store.ui;
  const modalIndex = modals.findIndex(modalItem => modalItem.id === id);
  const modal = modals[modalIndex];

  if (!modal) return Promise.resolve();

  return new Promise(resolve => {
    if (modal.isEntering) {
      runInAction(() => {
        modal.isLeaving = true;
        modal.isEntering = false;
      });

      return setTimeout(() => {
        modals.splice(modalIndex, 1);

        resolve();
      }, system.MODALS_LEAVING_TIMEOUT);
    }

    console.error(
      `modalRemove: modal ${modal.name} is called while MODALS_LEAVING_TIMEOUT not passed`
    );

    resolve();
  });
};
