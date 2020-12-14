import { FormEvent } from 'react';

import { TypeFormConfig } from 'models/TypeFormConfig';

export type TypeFormSubmit<T extends TypeFormConfig<T>> = (
  formData: { [Key in keyof Omit<T, 'SYSTEM' | 'submit'>]: T[Key]['value'] },
  event: FormEvent
) => Promise<any>;
