import { env } from '../../env';

import { hotReloadUrl } from './hotReloadUrl';

export function injectCSPProtection(str, res) {
  /**
   * @docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
   *
   */

  const ContentSecurityPolicyRules = {
    'default-src': `'self'`,
    'style-src': `'self' 'unsafe-inline' https://storage.yandexcloud.net https://fonts.googleapis.com`,
    'script-src': `'self' 'unsafe-inline' https://storage.yandexcloud.net https://apis.google.com https://mc.yandex.ru ${
      env.getParamAsBoolean('HOT_RELOAD') ? hotReloadUrl : ''
    }`,
    'font-src': `'self' https://fonts.gstatic.com`,
    'connect-src': `'self' ws: https://sentry.io https://mc.yandex.ru`,
    'img-src': `'self' https://storage.yandexcloud.net https://mc.yandex.ru`,
    'frame-src': `'self' https://accounts.google.com`,
  };

  const CSPJoined = Object.keys(ContentSecurityPolicyRules)
    .reduce((acc, key) => `${acc}${key} ${ContentSecurityPolicyRules[key]}; `, '')
    .trim();

  res.setHeader('Content-Security-Policy', CSPJoined);

  return str;
}
