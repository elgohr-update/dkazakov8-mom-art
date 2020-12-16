import { makeAutoObservable } from 'mobx';

import { TypeGalleryItems } from 'models';
import { uploadImageConfig, editImageConfig } from 'formConfigs';

export class StoreGallery {
  constructor() {
    makeAutoObservable(this);
  }

  items: TypeGalleryItems = [];
  editItemForm = editImageConfig;
  uploadItemForm = uploadImageConfig;
}
