import { createContext } from 'react';

import { TypeGlobals } from 'models';

export const StoreContext = createContext<TypeGlobals>(undefined);
