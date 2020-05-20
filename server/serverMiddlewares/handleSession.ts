import session from 'express-session';
import redisConnect from 'connect-redis';

import { dbClient } from 'db';

import { env } from '../../env';

const RedisStore = redisConnect(session);

export function handleSession(app) {
  app.use(
    session({
      secret: env.SESSION_SECRET,
      store: new RedisStore({
        client: dbClient,
      }),
      name: 'sid', // Should differ from localhost to localhost
      resave: true, // must be true when rolling === true
      rolling: true, // Prolongate session on each request (update cookie.expires to Date.now() + cookie.maxAge)
      saveUninitialized: false,
      cookie: {
        path: '/', // Root path of domain
        httpOnly: true, // JS won't see session in document.cookie
        maxAge: env.SESSION_DURATION, // ms
        secure: true, // Is https enabled?
        sameSite: 'strict',
      },
    })
  );
}
