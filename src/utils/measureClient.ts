export function measureClient(name: string) {
  return <T>(promiseReturnData: T): T => {
    if (performance) {
      const hasMark = performance.getEntriesByName(name, 'mark').length === 1;

      if (hasMark) {
        performance.measure(name, name);
      } else {
        performance.mark(name);
      }
    }

    return promiseReturnData;
  };
}
