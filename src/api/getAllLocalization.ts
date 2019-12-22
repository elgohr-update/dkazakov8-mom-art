import { validators } from 'utils/validateObject';

const { isPlainObject } = validators;

export const getAllLocalization = {
  name: `getAllLocalization`,
  url: `/get_all_localization`,
  method: 'POST',
  params: undefined,
  response: {
    translations: isPlainObject,
  },
  mock: {},
  isMocked: false,
};
