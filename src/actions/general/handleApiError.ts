import _ from 'lodash';

import { errorsNames, notificationTypes } from 'const';
import { createError } from 'utils';
import { messages } from 'utils/messages';
import { TypeAction } from 'models';

type Params = Error;

export const handleApiError: TypeAction<Params> = ({ store, actions }, error) => {
  if (error.name === errorsNames.SILENT) return Promise.resolve();

  /**
   * Hope that server is kind and sends
   * { errorName: 'SOME_CONSTANT', errorMessage: 'some error description' }
   *
   * if so, show localized notification to user & log to console real error
   * cause. Otherwise show to user INTERNAL_SERVER_ERROR message.
   *
   */

  const globalError = _.get(error, 'response.data') || {};
  const formattedError = globalError.errorName
    ? createError(globalError.errorName, globalError.errorMessage)
    : error;

  console.error(formattedError);

  actions.general.raiseNotification({
    type: notificationTypes.ERROR,
    message: store.getLn(messages[globalError.errorName] || messages.INTERNAL_SERVER_ERROR),
    delay: 0,
  });

  throw formattedError;
};
