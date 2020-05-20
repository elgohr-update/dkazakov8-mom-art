import _ from 'lodash';

import * as apiRoutes from 'api';
import { handleApiError } from 'serverUtils';
import * as routeControllers from 'routeControllers';
import { validateRequestParams } from 'actions/request';

export function handleApiRoutes(app) {
  // Automatically create route handlers for all controllers exported by routeControllers
  _.values({ ...apiRoutes }).forEach(routeConfig => {
    const controllerFn = routeControllers[`${routeConfig.name}Controller`];
    const method = routeConfig.method.toLowerCase();

    if (!controllerFn) {
      console.error(`handleApiRoutes: no controller for route ${routeConfig.name}`);
    }

    app[method](routeConfig.url, (req, res) => {
      const params = JSON.stringify(req.body) === '{}' ? undefined : req.body;

      return Promise.resolve()
        .then(() => validateRequestParams({ route: routeConfig, params }))
        .then(() => controllerFn({ req, res }))
        .then(data => res.send(data))
        .catch(error => handleApiError(error, res));
    });
  });
}
