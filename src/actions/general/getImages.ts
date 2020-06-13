import { TypeAction } from 'models';

export const getImages: TypeAction = ({ store, api }) => {
  return api.getImages().then(data => {
    store.gallery.items = data.images;
  });
};
