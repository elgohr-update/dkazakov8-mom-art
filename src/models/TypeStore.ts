import { StoreRoot } from 'stores/StoreRoot';
import GalleryConfig from 'pages/Gallery';

export type TypeStore = StoreRoot & typeof GalleryConfig.stores;
