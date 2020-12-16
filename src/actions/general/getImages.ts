import { runInAction } from 'mobx';

import { TypeAction } from 'models';

export const getImages: TypeAction = ({ store, api }) =>
  api.getImages().then(data =>
    runInAction(() => {
      store.gallery.items = data.images;
    })
  );
