import { actions } from 'actions';
import * as modularActions from 'pages/actions';
import { SkipFirstArgType } from 'common';

import { TypeGlobals } from './TypeGlobals';

type allActions = typeof actions & { gallery: typeof modularActions };

export type TypeAction<T = undefined> = T extends undefined
  ? (globals: TypeGlobals) => Promise<void>
  : (globals: TypeGlobals, params: T) => Promise<void>;

export type TypeActions = {
  [Group in keyof allActions]: {
    [FnName in keyof allActions[Group]]: SkipFirstArgType<allActions[Group][FnName]> & {
      data: {
        isExecuting: boolean;
      };
    };
  };
};
