import _ from 'lodash';

import { TypeAction } from 'models';

export const auth: TypeAction<any> = ({ store, api, actions }, formData) => {
  return api
    .auth({ email: formData.email, password: formData.password })
    .then(({ email, sessionExpires }) =>
      actions.general.setUserData({
        email,
        sessionExpires,
      })
    )
    .catch(_.noop);
};
