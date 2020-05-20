import _ from 'lodash';

import { ActionFirstParams } from 'models';

export function auth({ store }: ActionFirstParams, formData) {
  return store.actions.api
    .auth({ email: formData.email, password: formData.password })
    .then(({ email, sessionExpires }) =>
      store.actions.common.setUserData({
        email,
        sessionExpires,
      })
    )
    .catch(_.noop);
}
