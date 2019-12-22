import { makeObservable } from 'utils';

export interface GalleryItemType {
  id: string;
  title: {
    ru: string;
    en: string;
  };
  sources: {
    big: {
      src: string;
      width: number;
      height: number;
    };
    small: {
      src: string;
      width: number;
      height: number;
    };
  };
}

@makeObservable
export class StoreGallery {
  items: GalleryItemType[] = [];
  editItemForm = {};
  uploadItemForm = {};
}
