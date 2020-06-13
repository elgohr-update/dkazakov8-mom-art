import { system } from 'const';
import { TypeAction } from 'models';

type Params = { id?: string };

export const removeNotification: TypeAction<Params> = ({ store, actions }, { id }) => {
  const { notifications } = store.ui;

  const notificationIndex = notifications.findIndex(n => n.id === id);

  /**
   * Notification may be already removed, for example by user's click
   *
   */

  if (notificationIndex === -1) return Promise.resolve();

  const notification = notifications[notificationIndex];

  if (notification.status !== 'leaving') {
    /**
     * Set status 'leaving' and wait for fading animation is ended
     *
     */
    notification.status = 'leaving';

    setTimeout(
      () => actions.general.removeNotification(notification),
      system.MODALS_LEAVING_TIMEOUT
    );
  } else {
    /**
     * Animations are passed, remove from store
     *
     */

    notifications.splice(notificationIndex, 1);
  }

  return Promise.resolve();
};
