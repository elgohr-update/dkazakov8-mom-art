import _ from 'lodash';

import { ActionFirstParams } from 'commonUnsafe';
import { Form } from 'components/Form';
import { notificationTypes } from 'const';
import { messages } from 'utils/messages';
import { scrollToFirstElement } from 'utils';

export function handleFormError({ store }: ActionFirstParams, { error, storePath }) {
  return Promise.resolve()
    .then(() => JSON.parse(error.message))
    .then((errorParsed: { [key: string]: string }) => {
      Object.entries(errorParsed).forEach(([errorFieldName, errorConstant]) => {
        const errorField = _.get(store, `${storePath}.${errorFieldName}`);
        const errorFieldIncorrectValue = errorField.value;

        if (errorField) {
          errorField.validators.push({
            notValidCheck: ({ value }) => value === errorFieldIncorrectValue,
            message: messages[errorConstant] || errorConstant,
          });
        }
      });

      const notValidFieldsIds = Form.getNotValidFieldsIds({ formConfig: store.admin.form });

      if (notValidFieldsIds.length > 0) {
        return scrollToFirstElement(notValidFieldsIds);
      }
    })
    .catch(err => {
      store.actions.common.raiseNotification({
        type: notificationTypes.SUCCESS,
        message: err.message,
        delay: 3000,
      });
    });
}
