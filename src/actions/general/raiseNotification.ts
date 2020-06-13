import { generateId } from 'utils';
import { NotificationType } from 'common';
import { TypeAction } from 'models';

type Params = NotificationType;

export const raiseNotification: TypeAction<Params> = (
  { store, actions },
  { type, message, delay = 0 }
) => {
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
    setTimeout(() => actions.general.removeNotification({ id }), delay);
  }

  return Promise.resolve();
};
