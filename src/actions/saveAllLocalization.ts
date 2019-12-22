import { ActionFirstParams } from 'commonUnsafe';
import { notificationTypes } from 'const';

import { messages } from './messages';

export function saveAllLocalization({ store }: ActionFirstParams, { formData, storePath }) {
  return store.actions.api
    .saveAllLocalization({ formData })
    .then(() =>
      store.actions.common.raiseNotification({
        type: notificationTypes.SUCCESS,
        message: store.getLn(messages.translationsSaved),
        delay: 3000,
      })
    )
    .then(() => store.actions.common.getLocalization({ language: store.ui.currentLanguage }))
    .catch(error => store.actions.common.handleFormError({ error, storePath }));
}
