import { FieldValidatorType, MessageObjectType } from 'common';
import { TypeInputErrors } from 'models/TypeInputErrors';
import { icons } from 'assets/icons';

export interface TypeInputTextConfig {
  id?: string;
  icon?: keyof typeof icons;
  errors?: TypeInputErrors;
  disabled?: boolean;
  tabIndex?: number;
  maxLength?: number;
  autoFocus?: boolean;
  isFocused?: boolean;
  isValidFn?: () => boolean;
  labelData?: Record<string, any>;

  type: 'text' | 'password' | 'textarea';
  label: MessageObjectType;
  value: string;
  validators: Record<string, FieldValidatorType>;
}
