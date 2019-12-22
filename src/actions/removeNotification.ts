import { system } from 'const';
import { ActionFirstParams } from 'commonUnsafe';

export function removeNotification({ store }: ActionFirstParams, params: { id: string }) {
  const { id } = params;

  const { notifications } = store.ui;

  const notificationIndex = notifications.findIndex(n => n.id === id);

  /**
   * Notification may be already removed, for example by user's click
   *
   */

  if (notificationIndex === -1) {
    return Promise.resolve();
  }

  const notification = notifications[notificationIndex];

  if (notification.status !== 'leaving') {
    /**
     * Set status 'leaving' and wait for fading animation is ended
     *
     */
    notification.status = 'leaving';

    setTimeout(
      () => store.actions.common.removeNotification(notification),
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
}
