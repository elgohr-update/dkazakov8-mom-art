import { makeObservable } from 'utils';
import { TypeGalleryItems } from 'models';

@makeObservable
export class StoreGallery {
  items: TypeGalleryItems = [];
  editItemForm = {};
  uploadItemForm = {};
}
