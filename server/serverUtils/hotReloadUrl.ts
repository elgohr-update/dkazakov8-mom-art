import { env } from '../../env';

export const hotReloadUrl = `${
  env.getParamAsBoolean('HTTPS_BY_NODE') ? 'https' : 'http'
}://localhost:${env.getParam('HOT_RELOAD_PORT')}${env.getParam('HOT_RELOAD_CLIENT_URL')}`;
