import { TypeAction } from 'models';
import { notificationTypes } from 'const';

import { messages } from '../messages';

type Params = { formData: any; storePath: string };

export const saveAllLocalization: TypeAction<Params> = (
  { store, api, actions },
  { formData, storePath }
) => {
  return api
    .saveAllLocalization({ formData })
    .then(() =>
      actions.general.raiseNotification({
        type: notificationTypes.SUCCESS,
        message: store.getLn(messages.translationsSaved),
        delay: 3000,
      })
    )
    .then(() => actions.general.getLocalization({ language: store.ui.currentLanguage }))
    .catch(error => actions.general.handleFormError({ error, storePath }));
};
