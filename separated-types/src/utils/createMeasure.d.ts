export declare function createMeasure(): {
    wrap(name: string): (promiseReturnData: any) => any;
    getMeasures(): {
        [key: string]: number | bigint;
    };
};
