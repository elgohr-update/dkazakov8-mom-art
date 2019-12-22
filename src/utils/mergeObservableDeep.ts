import _ from 'lodash';
import { observable } from 'mobx';

export function mergeObservableDeep(
  target: { [key: string]: any },
  source: { [key: string]: any }
) {
  for (const key in source) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (_.isPlainObject(sourceValue)) {
      if (!targetValue) {
        target[key] = observable({});
      }

      mergeObservableDeep(target[key], sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }

  return target;
}
