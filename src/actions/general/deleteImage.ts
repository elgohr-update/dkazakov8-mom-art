import { runInAction } from 'mobx';

import { notificationTypes } from 'const';
import { messages } from 'actions/messages';
import { TypeAction } from 'models';

type Params = { id: string };

export const deleteImage: TypeAction<Params> = ({ store, actions, api }, { id }) =>
  api
    .deleteImage({ id })
    .then(data =>
      runInAction(() => {
        store.gallery.items = data.images;
      })
    )
    .then(() =>
      actions.general.raiseNotification({
        type: notificationTypes.SUCCESS,
        message: store.getLn(messages.imageDeleted),
        delay: 3000,
      })
    );
