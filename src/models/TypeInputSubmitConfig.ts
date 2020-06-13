import { MessageObjectType } from 'common';

export interface TypeInputSubmitConfig {
  id?: string;
  disabled?: boolean;
  tabIndex?: number;
  className?: string;
  labelData?: Record<string, any>;

  type: 'submit';
  label: MessageObjectType;
}
