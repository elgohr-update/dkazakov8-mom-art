import { StoreRoot } from 'stores/StoreRoot';
import * as modularStores from 'pages/Gallery/stores';

export type TypeStore = StoreRoot & typeof modularStores;
