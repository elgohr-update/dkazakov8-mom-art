import _ from 'lodash';

import { errorsNames } from 'const/errorsNames';
import { createError, validateObject, validators } from 'utils';

export function validateBodyParams(route, params) {
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
       * 'validateBodyParams: "email [isString]" has wrong value for route "auth"'
       *
       */

      throw createError(
        errorsNames.VALIDATION,
        `validateBodyParams: "${error.message}" has wrong value for route "${route.name}"`
      );
    });
}
