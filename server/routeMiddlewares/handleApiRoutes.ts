import _ from 'lodash';

import { apiRoutes } from 'const';
import { handleApiError, validateBodyParams } from 'serverUtils';
import * as routeControllers from 'routeControllers';

export function handleApiRoutes(app) {
  // Automatically create route handlers for all controllers exported by routeControllers
  _.values(apiRoutes).forEach(routeConfig => {
    const controllerFn = routeControllers[`${routeConfig.name}Controller`];
    const method = routeConfig.method.toLowerCase();

    if (!controllerFn) {
      console.error(`handleApiRoutes: no controller for route ${routeConfig.name}`);
    }

    app[method](routeConfig.url, (req, res) => {
      return Promise.resolve()
        .then(() => validateBodyParams(routeConfig, req.body))
        .then(() => controllerFn({ req, res }))
        .then(data => res.send(data))
        .catch(error => handleApiError(error, res));
    });
  });
}
