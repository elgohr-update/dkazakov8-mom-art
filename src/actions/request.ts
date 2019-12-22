import _ from 'lodash';
import axios, { AxiosRequestConfig } from 'axios';

import { errorsNames } from 'const';
import { createError, validateObject, validators } from 'utils';
import { ActionFirstParams } from 'commonUnsafe';

const routeControllers = IS_CLIENT ? null : require('routeControllers');

function ensureParamsArePassed({ route, params }) {
  if (!route.isFile && _.isPlainObject(route.params) && _.size(route.params) > 0) {
    if (!_.isPlainObject(params)) {
      throw createError(
        errorsNames.VALIDATION_CUSTOM,
        `request: params passed should be an object for route ${route.name}`
      );
    }
  }

  return Promise.resolve();
}

function validateRequestParams({ route, params }) {
  if (route.params == null || params == null || route.isFile) {
    return Promise.resolve();
  }

  return Promise.resolve()
    .then(() =>
      validateObject({
        // Skip validation of params with 'omitParam' validator
        rules: _.omitBy(route.params, v => v === validators.omitParam),
        data: params,
      })
    )
    .catch(error => {
      // Throw unknown errors
      if (error.name !== errorsNames.VALIDATION) {
        throw error;
      }

      /**
       * Wrap predictable VALIDATION errors with messages like
       * 'email [isString]'
       *
       * so they look like
       * 'request: request param "email [isString]" has wrong value for route "auth"'
       *
       */

      throw createError(
        error.name,
        `request: request param "${error.message}" has wrong value for route "${route.name}"`
      );
    });
}

function createRequestUrl({ route, params }) {
  if (!_.isString(route.url) && !_.isFunction(route.url)) {
    throw createError(
      errorsNames.VALIDATION_CUSTOM,
      `request: route.url is not a string or function for route ${route.name}`
    );
  }

  return _.isFunction(route.url) ? route.url(params) : route.url;
}

function sendRequest({ route, params, requestUrl, req, res }) {
  const { mock, method, isMocked } = route;

  if (!_.isString(method)) {
    throw createError(
      errorsNames.VALIDATION_CUSTOM,
      `request: route.method is not a string or function for route ${route.name}`
    );
  }

  if (isMocked) {
    if (!_.isPlainObject(mock) && !_.isArray(mock)) {
      throw createError(
        errorsNames.VALIDATION_CUSTOM,
        `request: mock is not an array or object for route ${route.name}`
      );
    }

    return mock;
  }

  const axiosParams: AxiosRequestConfig = {
    url: requestUrl,
    method: route.method,
    headers: Object.assign({}, route.headers),
  };

  if (_.isPlainObject(params)) {
    // Don't send params with 'omitParam' validator
    const clearedParams = _.pickBy(
      params,
      (value, key) => route.params[key] !== validators.omitParam
    );

    if (_.size(clearedParams) > 0) {
      axiosParams[route.method === 'GET' ? 'params' : 'data'] = clearedParams;
    }
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

function validateResponse({ route, params, responseData }) {
  const rules = _.isFunction(route.response) ? route.response({ responseData }) : route.response;

  if (!_.isPlainObject(rules)) {
    // Developer, read Readme carefully
    throw createError(
      errorsNames.VALIDATION_CUSTOM,
      `request: response scheme is invalid for route ${route.name}`
    );
  }

  return Promise.resolve()
    .then(() =>
      validateObject(
        {
          rules,
          data: responseData,
        },
        { params, responseData }
      )
    )
    .then(() => responseData)
    .catch(error => {
      // Throw unknown errors
      if (error.name !== errorsNames.VALIDATION) {
        throw error;
      }

      /**
       * Wrap predictable VALIDATION errors with messages like
       * 'email [isString]'
       *
       * so they look like
       * 'request: response param "email [isString]" has wrong value for route "auth"'
       *
       */

      throw createError(
        error.name,
        `request: response param "${error.message}" has wrong value for route "${route.name}"`
      );
    });
}

export function request({ store, req, res }: ActionFirstParams, route, params = {}) {
  return Promise.resolve()
    .then(() => ensureParamsArePassed({ route, params }))
    .then(() => validateRequestParams({ route, params }))
    .then(() => createRequestUrl({ route, params }))
    .then(requestUrl => sendRequest({ route, params, requestUrl, req, res }))
    .then(responseData => validateResponse({ route, params, responseData }))
    .catch(error => {
      if (IS_CLIENT) {
        return store.actions.common.handleApiError(error);
      }

      throw error;
    });
}
