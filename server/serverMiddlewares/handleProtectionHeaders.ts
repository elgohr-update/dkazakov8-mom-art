import helmet from 'helmet';

/**
 * @docs: https://github.com/helmetjs/helmet
 *
 */

export function handleProtectionHeaders(app) {
  app.use(helmet());
}
