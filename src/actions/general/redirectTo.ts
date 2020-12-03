import _ from 'lodash';
import { runInAction } from 'mobx';

import { routing } from 'utils';
import { routes } from 'routes';
import { Express } from 'common';
import { RouteType, TypeAction } from 'models';

type Params = {
  req?: Express['Request'];
  res?: Express['Response'];
  route?: RouteType;
};

export const redirectTo: TypeAction<Params> = (globals, { route, req, res }) => {
  const { store, actions } = globals;

  if (!route) {
    /**
     * IS_SERVER ?
     * This is initial call from server, we should extract url from req
     *
     * IS_CLIENT ?
     * This is expected to be browser's back/forward event, we should extract url from location
     *
     */

    const pathname = IS_CLIENT ? window.location.pathname : req.originalUrl;
    const nextRoute = routing.findRouteByPathname({ pathname }) || routes.error404;

    return actions.general.redirectTo({ route: nextRoute, req, res });
  }

  return Promise.resolve()
    .then(() => routing.setResponseStatus({ res, route }))
    .then(() =>
      runInAction(() => {
        /**
         * Optimistically update currentRoute and syncronize it
         * with browser's URL field
         *
         * (except 500 error) - it should be drawn without redirect,
         * so user could fix pathname or refresh the page and maybe get successful result
         *
         */
        store.router.currentRoute = route;

        if (IS_CLIENT && route.name !== routes.error500.name) {
          window.history.pushState(null, null, `/${store.ui.currentLanguage}${route.path}`);
        }
      })
    )
    .then(() => (route.beforeEnter || _.stubTrue)(globals))
    .catch(error => {
      /**
       * Log error happened in beforeEnter and draw error500 page
       * without changing URL
       *
       */
      console.error(error);

      return actions.general.redirectTo({ route: routes.error500, req, res });
    });
};
