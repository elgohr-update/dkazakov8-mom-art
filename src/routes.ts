import loadable from '@loadable/component';

import { addNames } from 'utils/addNames';
import { TypeGlobals } from 'models';

export const routesObject = {
  gallery: {
    path: '/',
    // @ts-ignore
    loader: loadable(() => import('pages/Gallery')),
  },
  about: {
    path: '/about',
    // @ts-ignore
    loader: loadable(() => import('pages/About')),
  },
  reviews: {
    path: '/reviews',
    // @ts-ignore
    loader: loadable(() => import('pages/Reviews')),
  },
  editLocalization: {
    path: '/edit-localization',
    rights: 'admin',
    // @ts-ignore
    loader: loadable(() => import('pages/EditLocalization')),
  },
  error404: {
    path: '/error404',
    // @ts-ignore
    loader: loadable(() => import('pages/ErrorPage')),
    props: {
      errorNumber: 404,
    },
  },
  error500: {
    path: '/error500',
    // @ts-ignore
    loader: loadable(() => import('pages/ErrorPage')),
    props: {
      errorNumber: 500,
    },
  },
};

export type RouteType<RouteName extends keyof typeof routesObject> = {
  name: RouteName;
  path: typeof routesObject[RouteName]['path'];
  loader: typeof routesObject[RouteName]['loader'];

  props?: Record<string, any>;
  rights?: string;
  validators?: Record<string, any>[];
  beforeEnter?: (params: TypeGlobals & { route?: RouteType<RouteName> }) => Promise<any>;
};

export const routes: { [Key in keyof typeof routesObject]: RouteType<Key> } = addNames(
  routesObject
);
