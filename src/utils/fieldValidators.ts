import { FieldValidatorType } from 'common';

import { messages } from './messages';

function isEmptyString({ value }: { value: string }) {
  return value === '';
}

function isNull({ value }: { value: any }) {
  return value == null;
}

export const fieldValidators = {
  emptyString: {
    notValidCheck: isEmptyString,
    message: messages.validator_empty,
  } as FieldValidatorType,
  isNull: {
    notValidCheck: isNull,
    message: messages.validator_empty,
  } as FieldValidatorType,
};
