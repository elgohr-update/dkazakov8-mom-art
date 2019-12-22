import { FieldValidatorType } from 'common';

import { messages } from './messages';

function isEmptyString({ value }: { value: number | string }) {
  return value === '';
}

interface FieldValidatorsType {
  [key: string]: FieldValidatorType;
}

export const fieldValidators: FieldValidatorsType = {
  emptyString: {
    notValidCheck: isEmptyString,
    message: messages.validator_empty,
  },
};
