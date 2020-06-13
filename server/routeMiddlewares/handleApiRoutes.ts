import _ from 'lodash';

import * as apiRaw from 'api';
import { handleApiError } from 'serverUtils';
import * as routeControllers from 'routeControllers';
import { validateRequestParams } from 'actions/general/request';

export function handleApiRoutes(app) {
  // Automatically create route handlers for all controllers exported by routeControllers
  _.mapValues(apiRaw, (route, apiName) => {
    const controllerFn = routeControllers[`${apiName}Controller`];
    const method = route.method.toLowerCase();

    if (!controllerFn) {
      console.error(`handleApiRoutes: no controller for route ${apiName}`);
    }

    app[method](route.url, (req, res) => {
      const params = JSON.stringify(req.body) === '{}' ? undefined : req.body;
      const requestParams = Object.assign({ apiName }, params);

      return Promise.resolve()
        .then(() => validateRequestParams({ requestParams }))
        .then(() => controllerFn({ req, res }))
        .then(data => res.send(data))
        .catch(error => handleApiError(error, res));
    });
  });
}
