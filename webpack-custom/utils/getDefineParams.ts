import { env } from '../../env';

export function getDefineParams({ isClient }) {
  return {
    IS_CLIENT: JSON.stringify(isClient),
    SENTRY_URL: JSON.stringify(env.SENTRY_URL),
  };
}
