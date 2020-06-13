import _ from 'lodash';

import { TypeFormSystem, TypeInputTextConfig } from 'models';
import { fieldValidators } from 'utils';
import { messages } from 'components/ModalsCollection/messages';

export const authFormConfig: TypeFormSystem & {
  email: TypeInputTextConfig;
  password: TypeInputTextConfig;
} = {
  email: {
    type: 'text',
    value: '',
    validators: { emptyString: fieldValidators.emptyString },
    label: messages.auth_email,
    icon: 'auth',
  },
  password: {
    type: 'text',
    value: '',
    validators: { emptyString: fieldValidators.emptyString },
    label: messages.auth_password,
    icon: 'key',
  },
  submit: {
    type: 'submit',
    label: messages.auth_submitButton,
  },
  SYSTEM: {
    isSubmitting: false,
    clear({ formConfigInStore }) {
      const formConfigOriginal = authFormConfig;
      const formConfigWithoutSystem = _.omit(formConfigInStore, ['SYSTEM', 'submit']);

      for (const name in formConfigWithoutSystem) {
        formConfigInStore[name].value = formConfigOriginal[name].value;
        formConfigInStore[name].validators = formConfigOriginal[name].validators;
      }
    },
  },
};
