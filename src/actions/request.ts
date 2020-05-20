import _ from 'lodash';
import { createCheckers } from 'ts-interface-checker';
import axios, { AxiosRequestConfig } from 'axios';

import { errorsNames } from 'const';
import { createError } from 'utils';
import { ActionFirstParams } from 'models';
import * as apiValidatorsTypes from 'validators/api';

const apiValidators = _.mapValues(apiValidatorsTypes, value => createCheckers(value));

const routeControllers = IS_CLIENT ? null : require('routeControllers');

export function validateRequestParams({ route, params }) {
  if (route.isFile) return Promise.resolve();

  return Promise.resolve()
    .then(() => {
      const requestValidator = _.get(apiValidators, `${[route.name]}.TypeRequestParams`);

      return requestValidator.strictCheck(params);
    })
    .catch(error => {
      throw createError(
        errorsNames.VALIDATION,
        `request: (request params) ${error.message} for route "${route.name}"`
      );
    });
}

function sendRequest({ route, params, requestUrl, req, res }) {
  const axiosParams: AxiosRequestConfig = {
    url: requestUrl,
    method: route.method,
    headers: Object.assign({}, route.headers),
  };

  if (params != null) {
    axiosParams[route.method === 'GET' ? 'params' : 'data'] = params;
  } else if (route.isFile) {
    axiosParams.data = params;
  }

  if (!IS_CLIENT) {
    const controllerFn = routeControllers[`${route.name}Controller`];

    if (!controllerFn) {
      return Promise.reject(
        createError(errorsNames.INTERNAL_SERVER_ERROR, `No controller for apiRoute "${route.name}"`)
      );
    }

    req.body = axiosParams.params || axiosParams.data;

    return controllerFn({ req, res });
  }

  return axios(axiosParams).then(response => response.data);
}

function validateResponse({ route, responseData }) {
  const response = JSON.stringify(responseData) === '{}' ? undefined : responseData;

  return Promise.resolve()
    .then(() => {
      const responseValidator = _.get(apiValidators, `${[route.name]}.TypeResponseParams`);

      return responseValidator.strictCheck(response);
    })
    .then(() => response)
    .catch(error => {
      throw createError(
        errorsNames.VALIDATION,
        `request: (response params) ${error.message} for route "${route.name}"`
      );
    });
}

export function request({ store, req, res }: ActionFirstParams, route, params) {
  return Promise.resolve()
    .then(() => validateRequestParams({ route, params }))
    .then(() =>
      sendRequest({
        req,
        res,
        route,
        params,
        requestUrl: _.isFunction(route.url) ? route.url(params) : route.url,
      })
    )
    .then(responseData => validateResponse({ route, responseData }))
    .catch(error => {
      if (IS_CLIENT) return store.actions.common.handleApiError(error);

      throw error;
    });
}
