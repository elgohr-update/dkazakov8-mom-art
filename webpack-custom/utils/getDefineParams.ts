import { env } from '../../env';

export function getDefineParams({ isClient }) {
  return {
    IS_CLIENT: JSON.stringify(isClient),
    SENTRY_URL: JSON.stringify(env.getParam('SENTRY_URL')),
    ASSETS_PATH: JSON.stringify(env.getParam('ASSETS_PATH')),
    GOOGLE_CLIENT_ID: JSON.stringify(env.getParam('GOOGLE_CLIENT_ID')),
  };
}
