import { validators } from 'utils/validateObject';

const { isString } = validators;

export const setTheme = {
  name: `setTheme`,
  url: `/themes`,
  method: 'POST',
  params: {
    theme: isString,
  },
  response: {},
  mock: {
    theme: 'light',
  },
  isMocked: false,
};
