import { validators } from 'utils/validateObject';

const { isString, isNumber } = validators;

export const auth = {
  name: `auth`,
  url: `/auth`,
  method: 'POST',
  params: {
    email: isString,
    password: isString,
  },
  response: {
    email: isString,
    sessionExpires: isNumber,
  },
  mock: {
    name: 'Test user',
    email: 'user@domain.com',
    sessionExpires: Date.now(),
  },
  isMocked: false,
};
