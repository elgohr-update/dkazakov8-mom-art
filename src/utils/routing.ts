import _ from 'lodash';

import { routes } from 'routes';
import { Express } from 'common';
import { RouteType, RoutesType } from 'models';

function isDynamic(param: string) {
  return param.indexOf(':') === 0;
}

function clearDynamic(param: string) {
  return param.replace(':', '');
}

function findRoute(params: { routesObject: RoutesType; pathname: string }) {
  const { routesObject, pathname } = params;

  const pathnameArray = pathname.split('/').filter(Boolean);

  return _.find(routesObject, ({ path, validators }) => {
    const routePathnameArray = path.split('/').filter(Boolean);

    if (routePathnameArray.length !== pathnameArray.length) {
      return false;
    }

    /**
     * Dynamic params must have functional validators
     *
     */

    for (let i = 0; i < routePathnameArray.length; i++) {
      const paramName = routePathnameArray[i];
      const paramNameFromUrl = pathnameArray[i];

      if (!isDynamic(paramName)) {
        if (paramName !== paramNameFromUrl) {
          return false;
        }
      } else {
        const validator = _.get(validators, clearDynamic(paramName));

        if (typeof validator !== 'function') {
          throw new Error(`findRoute: missing mask for param "${paramName}"`);
        }

        if (!validator(paramNameFromUrl)) {
          return false;
        }
      }
    }

    return true;
  });
}

function findRouteByPathname({ pathname }: { pathname: string }) {
  const pathnameWithoutLang = pathname.replace(/\/[^/]+/, '');

  /**
   * route /test/edit should take precedence over /test/:someParam
   *
   */

  const routesWithoutDynamic = Object.keys(routes)
    .filter(key => !isDynamic(routes[key].path))
    .reduce((acc, key) => ({ ...acc, [key]: routes[key] }), {});

  let foundRoute = findRoute({
    routesObject: routesWithoutDynamic,
    pathname: pathnameWithoutLang,
  });

  if (!foundRoute) {
    const routesWithDynamic = Object.keys(routes)
      .filter(key => isDynamic(routes[key].path))
      .reduce((acc, key) => ({ ...acc, [key]: routes[key] }), {});

    foundRoute = findRoute({ routesObject: routesWithDynamic, pathname: pathnameWithoutLang });
  }

  return foundRoute;
}

function setResponseStatus(params: { res: Express['Response']; route: RouteType }) {
  const { res, route } = params;

  if (res && route.name === routes.error404.name) {
    res.status(404);
  }
}

// Group utils in named export
export const routing = {
  setResponseStatus,
  findRouteByPathname,
};
