import _ from 'lodash';

import { MessageObjectType } from 'common';

export function wrapMessages<T extends Record<string, string>>(
  dirname: string,
  obj: T
): Record<keyof T, MessageObjectType> {
  return _.mapValues(obj, (value, key) => ({
    name: `${dirname.toLowerCase().replace(/\\/g, '/')}__${key}`,
    defaultValue: obj[key],
  }));
}
