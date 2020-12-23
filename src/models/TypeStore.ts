import { StoreRoot } from 'store';
import * as staticStores from 'stores';
import * as modularStores from 'pages/stores';

export type TypeStore = StoreRoot & typeof staticStores & typeof modularStores;
