import { addNames } from 'utils/addNames';
import { RoutesType } from 'models';

const routesObject: RoutesType = {
  gallery: {
    path: '/',
    beforeEnter({ actions }) {
      return actions.general.getImages();
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
    beforeEnter({ actions }) {
      return actions.general.getAllLocalization();
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
