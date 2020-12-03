import { runInAction } from 'mobx';

import { TypeAction } from 'models';

export const getImages: TypeAction = ({ store, api }) => {
  return api.getImages().then(data =>
    runInAction(() => {
      store.gallery.items = data.images;
    })
  );
};
