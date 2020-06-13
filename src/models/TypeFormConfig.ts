import { TypeInputTextConfig } from 'models/TypeInputTextConfig';
import { TypeInputSubmitConfig } from 'models/TypeInputSubmitConfig';

export type TypeFormSystem = {
  SYSTEM: {
    isSubmitting: boolean;
    clear?: ({ formConfigInStore }: { formConfigInStore: any }) => void;
  };
  submit: TypeInputSubmitConfig;
};

export type TypeFormConfig<T> = {
  [Key in Extract<T, string>]?: TypeInputTextConfig;
} &
  TypeFormSystem;
