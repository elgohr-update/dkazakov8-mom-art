export function proxy() {
  const handler: ProxyHandler<any> = {
    get(target, paramName) {
      if (paramName === 'toString' || paramName === Symbol.toPrimitive) {
        return () => target.join('.');
      }

      target.push(paramName);

      return new Proxy(target, handler);
    },
  };

  return new Proxy([], handler);
}
