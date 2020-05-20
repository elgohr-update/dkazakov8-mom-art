import { generateId } from 'utils';
import { NotificationType } from 'common';
import { ActionFirstParams } from 'models';

export function raiseNotification({ store }: ActionFirstParams, params: NotificationType) {
  const { type, message, delay = 0 } = params;

  const { notifications } = store.ui;

  const alreadyUsedIds = notifications.map(({ id }) => id);
  const id = generateId({ excludedIds: alreadyUsedIds });

  const notification = {
    id,
    type,
    delay,
    message,
    status: 'entering',
  };

  notifications.push(notification);

  if (delay !== 0) {
    setTimeout(() => store.actions.common.removeNotification({ id }), delay);
  }

  return Promise.resolve();
}
