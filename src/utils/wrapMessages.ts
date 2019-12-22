import _ from 'lodash';

import { MessageObjectType } from 'common';

export function wrapMessages(
  dirname: string,
  obj: { [key: string]: string }
): { [key: string]: MessageObjectType } {
  return _.mapValues(obj, (value, key) => ({
    name: `${dirname.toLowerCase().replace(/\\/g, '/')}__${key}`,
    defaultValue: obj[key],
  }));
}
