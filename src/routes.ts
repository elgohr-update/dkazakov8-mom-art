import { addNames } from 'utils/addNames';
import { TypeGlobals } from 'models';

export const routesObject = {
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

export type RouteType = {
  name: keyof typeof routesObject;
  path: string;

  rights?: string;
  validators?: Record<string, any>[];
  beforeEnter?: (params: TypeGlobals & { route?: RouteType }) => Promise<any>;
};

export const routes: Record<keyof typeof routesObject, RouteType> = addNames(routesObject);
