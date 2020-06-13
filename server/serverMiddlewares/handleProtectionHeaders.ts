import helmet from 'helmet';

import { hotReloadUrl } from 'serverUtils';

import { env } from '../../env';

/**
 * @docs: https://github.com/helmetjs/helmet
 *
 */

const self = `'self'`;
const unsafeInline = `'unsafe-inline'`;
const sentryWs = `ws: https://sentry.io`;
const yandexAnalytics = `https://mc.yandex.ru`;

export function handleProtectionHeaders(app) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        /**
         * @docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
         *
         */

        directives: {
          defaultSrc: [self],
          styleSrc: [self, unsafeInline, env.CDN_ENDPOINT],
          scriptSrc: [
            self,
            unsafeInline,
            env.CDN_ENDPOINT,
            yandexAnalytics,
            env.HOT_RELOAD ? hotReloadUrl : '',
          ],
          fontSrc: [self, env.CDN_ENDPOINT],
          connectSrc: [self, sentryWs, yandexAnalytics],
          imgSrc: [self, env.CDN_ENDPOINT, yandexAnalytics],
          frameSrc: [self],
        },
        reportOnly: false,
      },
    })
  );
}
