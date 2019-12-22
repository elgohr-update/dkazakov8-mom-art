import { action, computed, decorate, observable } from 'mobx';

import { EmptyClassType } from 'common';

export function makeObservable<T extends EmptyClassType>(targetClass: T) {
  /**
   * Decorate methods with @action.bound
   * Wrap getters with @computed
   *
   */

  const classPrototype = targetClass.prototype;
  const methodsAndGetters = Object.getOwnPropertyNames(classPrototype).filter(
    methodName => methodName !== 'constructor'
  );

  for (const methodName of methodsAndGetters) {
    const descriptor = Object.getOwnPropertyDescriptor(classPrototype, methodName);

    descriptor.value = decorate(classPrototype, {
      [methodName]: typeof descriptor.value === 'function' ? action.bound : computed,
    });
  }

  const newTargetClass: any = function decoratedClass(...constructorArguments: any[]): any {
    const store = new targetClass(...constructorArguments);
    const staticProperties = Object.keys(store);

    staticProperties.forEach(propName => {
      const descriptor = Object.getOwnPropertyDescriptor(store, propName);

      Object.defineProperty(store, propName, observable(store, propName, descriptor));
    });
    return store;
  };

  newTargetClass.prototype = targetClass.prototype;

  return newTargetClass;
}
