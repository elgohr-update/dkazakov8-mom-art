import _ from 'lodash';

import { env, allowedClientKeys } from '../../env';

export function getDefineParams({ isClient }) {
  return {
    IS_CLIENT: JSON.stringify(isClient),
    'process.env': JSON.stringify(isClient ? _.pick(env, allowedClientKeys) : env),
  };
}
