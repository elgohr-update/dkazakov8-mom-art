import { system } from 'const';
import { ActionFirstParams } from 'models';

export function removeModal({ store }: ActionFirstParams, params: { id: string }) {
  const { id } = params;
  const { modals } = store.ui;
  const modalIndex = modals.findIndex(modalItem => modalItem.id === id);

  return new Promise(resolve => {
    if (modalIndex === -1) {
      return resolve();
    }

    const modal = modals[modalIndex];

    /**
     * Set status 'leaving' and wait for fading animation is ended
     *
     */

    if (modal.status !== 'leaving') {
      modal.status = 'leaving';

      return setTimeout(() => {
        /**
         * Animations are passed, remove from store
         *
         */

        modals.splice(modalIndex, 1);

        return resolve();
      }, system.MODALS_LEAVING_TIMEOUT);
    }

    console.error(
      `removeModal: modal ${modal.name} is called while MODALS_LEAVING_TIMEOUT not passed`
    );

    return resolve();
  });
}
