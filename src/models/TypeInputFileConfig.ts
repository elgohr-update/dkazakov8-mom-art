import { FieldValidatorType, MessageObjectType } from 'common';
import { TypeInputErrors } from 'models';
import { icons } from 'assets/icons';

export interface TypeInputFileConfig {
  id?: string;
  icon?: keyof typeof icons;
  label?: MessageObjectType;
  errors?: TypeInputErrors;
  disabled?: boolean;
  labelData?: Record<string, any>;

  type: 'file';
  value: File;
  tabIndex?: number;
  isFocused?: boolean;
  isValidFn?: () => boolean;
  validators: Record<string, FieldValidatorType>;
}
