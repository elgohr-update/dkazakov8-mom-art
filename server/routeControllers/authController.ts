import { errorsNames } from 'const';
import { createError } from 'utils';

import { env } from '../../env';

const validUsers = env.ALLOWED_EMAILS.split(',').map(item => {
  const [email, password] = item.split(':');

  return { email, password };
});

export function authController({ req }) {
  return Promise.resolve().then(() => {
    const { email, password } = req.body;

    const validUserData = validUsers.find(userData => userData.email === email);

    if (!validUserData || password !== validUserData.password) {
      throw createError(errorsNames.NOT_ALLOWED, `Invalid credentials`);
    }

    req.session.email = email;

    return { email, sessionExpires: req.session.cookie.expires.getTime() };
  });
}
