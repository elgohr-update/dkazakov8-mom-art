import { notificationTypes } from 'const';
import { messages } from 'actions/messages';
import { TypeAction } from 'models';

type Params = { id: string };

export const deleteImage: TypeAction<Params> = ({ store, actions, api }, { id }) => {
  return api
    .deleteImage({ id })
    .then(data => (store.gallery.items = data.images))
    .then(() =>
      actions.general.raiseNotification({
        type: notificationTypes.SUCCESS,
        message: store.getLn(messages.imageDeleted),
        delay: 3000,
      })
    );
};
