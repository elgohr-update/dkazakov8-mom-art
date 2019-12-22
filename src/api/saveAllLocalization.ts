import { validators } from 'utils/validateObject';

const { isPlainObject } = validators;

export const saveAllLocalization = {
  name: `saveAllLocalization`,
  url: `/save_all_localization`,
  method: 'POST',
  params: {
    formData: isPlainObject,
  },
  response: {},
  mock: {},
  isMocked: false,
};
