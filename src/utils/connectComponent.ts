import { inject, observer } from 'mobx-react';

// Can't extend props with store type (https://github.com/Microsoft/TypeScript/issues/4881)
export function connectComponent<T>(component: T): T {
  return inject('store')(observer(component));
}
