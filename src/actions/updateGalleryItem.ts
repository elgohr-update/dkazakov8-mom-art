import { ActionFirstParams } from 'models';
import { notificationTypes } from 'const';

import { messages } from './messages';

export function updateGalleryItem({ store }: ActionFirstParams, { formData, storePath }) {
  return store.actions.api
    .updateGalleryItem(formData)
    .then(data => (store.gallery.items = data.images))
    .then(() =>
      store.actions.common.raiseNotification({
        type: notificationTypes.SUCCESS,
        message: store.getLn(messages.galleryItemUpdated),
        delay: 3000,
      })
    )
    .catch(error => store.actions.common.handleFormError({ error, storePath }));
}
