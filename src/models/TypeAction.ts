import { actions } from 'actions';
import { SkipFirstArgType } from 'common';

import { TypeGlobals } from './TypeGlobals';

export type TypeAction<T = undefined> = T extends undefined
  ? (globals: TypeGlobals) => Promise<void>
  : (globals: TypeGlobals, params: T) => Promise<void>;

export type TypeActions = {
  [Group in keyof typeof actions]: {
    [FnName in keyof typeof actions[Group]]: SkipFirstArgType<typeof actions[Group][FnName]> & {
      data: {
        isExecuting: boolean;
      };
    };
  };
};
