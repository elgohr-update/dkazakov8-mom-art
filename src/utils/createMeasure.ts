function bigIntToMs(bigInt: bigint) {
  return Number((Number(bigInt) / 1000000).toFixed(3));
}

export function createMeasure() {
  const measures: { [key: string]: number | bigint } = {};

  return {
    wrap(name: string) {
      return (promiseReturnData: any) => {
        const currentTime = process.hrtime.bigint();
        const startMark = measures[name];

        if (!startMark) {
          measures[name] = currentTime;
        } else {
          measures[name] = bigIntToMs(currentTime - (startMark as bigint));
        }

        return promiseReturnData;
      };
    },
    getMeasures() {
      return measures;
    },
  };
}
