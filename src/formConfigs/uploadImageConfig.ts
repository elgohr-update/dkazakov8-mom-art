import _ from 'lodash';
import cn from 'classnames';

import { TypeFormSystem, TypeInputTextConfig, TypeInputFileConfig } from 'models';
import { fieldValidators } from 'utils';
import { messages } from 'components/ModalsCollection/messages';
import styles from 'components/ModalsCollection/ModalsCollection.scss';

export const uploadImageConfig: TypeFormSystem & {
  title_ru: TypeInputTextConfig;
  title_en: TypeInputTextConfig;
  file: TypeInputFileConfig;
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
  file: {
    type: 'file',
    value: null,
    validators: { isNull: fieldValidators.isNull },
  },
  submit: {
    type: 'submit',
    label: messages.uploadImage_saveButton,
    className: cn(styles.saveButton, styles.fullWidth),
  },
  SYSTEM: {
    isSubmitting: false,
    clear({ formConfigInStore }) {
      const formConfigOriginal = uploadImageConfig;
      const formConfigWithoutSystem = _.omit(formConfigInStore, ['SYSTEM', 'submit']);

      for (const name in formConfigWithoutSystem) {
        formConfigInStore[name].value = formConfigOriginal[name].value;
        formConfigInStore[name].validators = formConfigOriginal[name].validators;
      }
    },
  },
};
