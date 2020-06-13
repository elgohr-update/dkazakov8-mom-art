import * as apiRaw from 'api';

type TypeApiFunction<T extends keyof typeof apiRaw> = (
  requestParams?: typeof apiRaw[T]['params']
) => Promise<typeof apiRaw[T]['response']>;

export type TypeApi = {
  [FnName in keyof typeof apiRaw]: TypeApiFunction<FnName> & {
    data: {
      isExecuting: boolean;
    };
  };
};
