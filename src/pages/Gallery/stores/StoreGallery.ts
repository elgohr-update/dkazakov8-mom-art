import { makeAutoObservable } from 'mobx';

import { TypeGalleryItems } from 'models/TypeGalleryItems';
import { uploadImageConfig, editImageConfig } from 'formConfigs';

class StoreGallery {
  constructor() {
    makeAutoObservable(this);
  }

  items: TypeGalleryItems = [];
  editItemForm = editImageConfig;
  uploadItemForm = uploadImageConfig;
}

export const gallery = new StoreGallery();
