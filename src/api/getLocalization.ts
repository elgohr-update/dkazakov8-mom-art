import { validators } from 'utils/validateObject';

const { isString, isPlainObject } = validators;

export const getLocalization = {
  name: `getLocalization`,
  url: `/get_current_localization`,
  method: 'POST',
  params: {
    language: isString,
  },
  response: {
    translations: isPlainObject,
  },
  mock: {},
  isMocked: false,
};
