import _ from 'lodash';

import { TypeFormSystem, TypeInputTextConfig } from 'models';
import { fieldValidators } from 'utils/fieldValidators';
import { messages } from 'components/ModalsCollection/messages';
import styles from 'components/ModalsCollection/ModalsCollection.scss';

export const editImageConfig: TypeFormSystem & {
  title_ru: TypeInputTextConfig;
  title_en: TypeInputTextConfig;
  order: TypeInputTextConfig;
} = {
  title_ru: {
    type: 'text',
    value: '',
    validators: { emptyString: fieldValidators.emptyString },
    label: messages.uploadImage_imageTitle,
    labelData: { lang: 'русский' },
  },
  title_en: {
    type: 'text',
    value: '',
    validators: { emptyString: fieldValidators.emptyString },
    label: messages.uploadImage_imageTitle,
    labelData: { lang: 'english' },
  },
  order: {
    type: 'text',
    value: '',
    validators: { emptyString: fieldValidators.emptyString },
    label: messages.uploadImage_order,
  },
  submit: {
    type: 'submit',
    label: messages.uploadImage_saveButton,
    className: styles.saveButton,
  },
  SYSTEM: {
    isSubmitting: false,
    clear({ formConfigInStore }) {
      const formConfigOriginal = editImageConfig;
      const formConfigWithoutSystem = _.omit(formConfigInStore, ['SYSTEM', 'submit']);

      for (const name in formConfigWithoutSystem) {
        formConfigInStore[name].value = formConfigOriginal[name].value;
        formConfigInStore[name].validators = formConfigOriginal[name].validators;
      }
    },
  },
};
