import _ from 'lodash';

import { TypeAction } from 'models';
import { notificationTypes } from 'const';
import { messages } from 'utils/messages';
import { scrollToFirstElement, getNotValidFieldsIds } from 'utils';

type Params = { error: Error; storePath: string };

export const handleFormError: TypeAction<Params> = ({ store, actions }, { error, storePath }) => {
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

      const notValidFieldsIds = getNotValidFieldsIds({ formConfig: store.admin.form });

      if (notValidFieldsIds.length > 0) return scrollToFirstElement(notValidFieldsIds);
    })
    .catch(err => {
      actions.general.raiseNotification({
        type: notificationTypes.SUCCESS,
        message: err.message,
        delay: 3000,
      });
    });
};
