import { notificationTypes } from 'const';
import { messages } from 'actions/messages';
import { ActionFirstParams } from 'models';

export function deleteImage({ store }: ActionFirstParams, { id }) {
  return store.actions.api
    .deleteImage({ id })
    .then(data => (store.gallery.items = data.images))
    .then(() =>
      store.actions.common.raiseNotification({
        type: notificationTypes.SUCCESS,
        message: store.getLn(messages.imageDeleted),
        delay: 3000,
      })
    );
}
