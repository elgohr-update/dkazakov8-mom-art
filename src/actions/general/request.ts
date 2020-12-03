import _ from 'lodash';
import { createCheckers } from 'ts-interface-checker';
import axios, { AxiosRequestConfig } from 'axios';

import { errorsNames } from 'const';
import { createError } from 'utils';
import { TypeAction } from 'models';
import * as apiValidatorsTypes from 'validators/api';

const apiValidators = _.mapValues(apiValidatorsTypes, value => createCheckers(value));

const controllers = IS_CLIENT ? null : require('Server/controllers');

function sendRequest({ params, requestParams }) {
  const { req, res, route } = params;

  const axiosParams: AxiosRequestConfig = {
    url: _.isFunction(route.url) ? route.url(requestParams) : route.url,
    method: route.method,
    headers: Object.assign({}, route.headers),
  };

  if (requestParams != null) {
    axiosParams[route.method === 'GET' ? 'params' : 'data'] = requestParams;
  }

  if (!IS_CLIENT) {
    const controllerFn = controllers[route.name];

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

function validateResponse({ requestParams, response }) {
  if (!requestParams.apiName) return Promise.resolve();

  // Treat empty object as undefined
  const resp = JSON.stringify(response) === '{}' ? undefined : response;
  const validatorsList = apiValidators[requestParams.apiName];

  return Promise.resolve()
    .then(() => validatorsList.TypeResponse.strictCheck(resp))
    .then(() => resp)
    .catch(error => {
      throw createError(
        errorsNames.VALIDATION,
        `request: (response params) ${error.message} for route "${requestParams.apiName}"`
      );
    });
}

export function validateRequestParams({ requestParams }) {
  if (!requestParams.apiName) return Promise.resolve();

  const validatorsList = apiValidators[requestParams.apiName];

  let paramsToValidate = _.omit(requestParams, ['apiName']);
  if (_.isEmpty(paramsToValidate)) paramsToValidate = undefined;

  return Promise.resolve()
    .then(() => validatorsList.TypeRequestParams.strictCheck(paramsToValidate))
    .catch(error => {
      throw createError(
        errorsNames.VALIDATION,
        `request: (request params) ${error.message} for route "${requestParams.apiName}"`
      );
    });
}

export const request: TypeAction<any> = ({ actions }, params) => {
  const requestParams = _.omit(params, ['req', 'res', 'route']);

  return Promise.resolve()
    .then(() => validateRequestParams({ requestParams }))
    .then(() =>
      sendRequest({
        params,
        requestParams,
      })
    )
    .then(response => validateResponse({ requestParams, response }))
    .catch(error => {
      if (IS_CLIENT) return actions.general.handleApiError(error);

      throw error;
    });
};
