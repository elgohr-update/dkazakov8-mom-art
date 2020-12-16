import { addNames } from 'utils/addNames';
import { TypeGlobals } from 'models';

export const routesObject = {
  gallery: {
    path: '/',
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
  },
  error404: {
    path: '/error404',
  },
  error500: {
    path: '/error500',
  },
};

export type RouteType<RouteName extends keyof typeof routesObject> = {
  name: RouteName;
  path: typeof routesObject[RouteName]['path'];

  props?: Record<string, any>;
  rights?: string;
  validators?: Record<string, any>[];
  beforeEnter?: (params: TypeGlobals & { route?: RouteType<RouteName> }) => Promise<any>;
};

export const routes: { [Key in keyof typeof routesObject]: RouteType<Key> } = addNames(
  routesObject
);
