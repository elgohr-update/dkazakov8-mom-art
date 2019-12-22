import { addNames } from 'utils/addNames';
import { RoutesType } from 'common';

const routesObject: RoutesType = {
  gallery: {
    path: '/',
    beforeEnter(store) {
      return store.actions.common.getImages();
    },
  },
  about: {
    path: '/about',
  },
  reviews: {
    path: '/reviews',
  },
  editLocalization: {
    path: '/edit-localization',
    rights: 'admin',
    beforeEnter(store) {
      return store.actions.common.getAllLocalization();
    },
  },
  error404: {
    path: '/error404',
  },
  error500: {
    path: '/error500',
  },
};

export const routes = addNames(routesObject);
