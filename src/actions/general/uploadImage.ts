import { runInAction } from 'mobx';

import { TypeAction } from 'models';
import { notificationTypes } from 'const';

import { messages } from '../messages';

type Params = { formData: any; storePath: string };

export const uploadImage: TypeAction<Params> = (
  { store, actions, api },
  { formData, storePath }
) => {
  return api
    .uploadImage(formData)
    .then(data =>
      runInAction(() => {
        store.gallery.items = data.images;
      })
    )
    .then(() =>
      actions.general.raiseNotification({
        type: notificationTypes.SUCCESS,
        message: store.getLn(messages.imageUploaded),
        delay: 3000,
      })
    )
    .catch(error => actions.general.handleFormError({ error, storePath }));
};
