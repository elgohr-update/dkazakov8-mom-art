import _ from 'lodash';

type Devtool =
  | 'eval'
  | 'eval-cheap-source-map'
  | 'eval-cheap-module-source-map'
  | 'eval-source-map'
  | 'eval-nosources-source-map'
  | 'eval-nosources-cheap-source-map'
  | 'eval-nosources-cheap-module-source-map'
  | 'cheap-source-map'
  | 'cheap-module-source-map'
  | 'inline-cheap-source-map'
  | 'inline-cheap-module-source-map'
  | 'inline-source-map'
  | 'inline-nosources-source-map'
  | 'inline-nosources-cheap-source-map'
  | 'inline-nosources-cheap-module-source-map'
  | 'source-map'
  | 'hidden-source-map'
  | 'hidden-nosources-source-map'
  | 'hidden-nosources-cheap-source-map'
  | 'hidden-nosources-cheap-module-source-map'
  | 'hidden-cheap-source-map'
  | 'hidden-cheap-module-source-map'
  | 'nosources-source-map'
  | 'nosources-cheap-source-map'
  | 'nosources-cheap-module-source-map';

class Env {
  constructor(params: Record<string, any>) {
    Object.entries(params).forEach(([envKey, envValue]) => {
      const paramType = typeof this[envKey];

      if (paramType === 'boolean') this[envKey] = envValue === true || envValue === 'true';
      else if (paramType === 'string') this[envKey] = (envValue || '').replace(/"/g, '').trim();
      else if (paramType === 'number') this[envKey] = Number(envValue || 0);
    });
  }

  SENTRY_URL = '';
  GIT_COMMIT = '';
  HOT_RELOAD = false;
  HOT_RELOAD_PORT = 0;
  USE_TS_LOADER = false;
  DEPS_GRAPH = false;
  POLYFILLING = false;
  DROP_CONSOLE = false;
  FILENAME_HASH = false;
  CIRCULAR_CHECK = false;
  BUNDLE_ANALYZER = false;
  MINIMIZE_CLIENT = false;
  MINIMIZE_SERVER = false;
  AGGREGATION_TIMEOUT = 0;
  GENERATE_COMPRESSED = false;
  BUNDLE_ANALYZER_PORT = 0;
  START_SERVER_AFTER_BUILD = false;
  DEV_TOOL: Devtool = 'eval-cheap-module-source-map';
  DEV_TOOL_SERVER: Devtool = 'eval-cheap-module-source-map';
  SESSION_DURATION = 0;
  ALLOWED_EMAILS = '';
  SESSION_SECRET = '';

  LOGS_WATCHED_FILES = false;

  CDN_ENABLED = false;
  CDN_BUCKET = '';
  CDN_ENDPOINT = '';
  CDN_BUCKET_PREFIX = '';
  CDN_ACCESS_KEY_ID = '';
  CDN_SECRET_ACCESS_KEY = '';

  NODE_ENV: `development` | `production` = `development`;
  NODE_PATH = '';
  EXPRESS_PORT = 0;
  HTTPS_BY_NODE = false;

  LOGS_GENERATE_FILES = false;
  LOGS_CDN = false;

  REDIS_PORT_6379_TCP_ADDR = '';
  REDIS_PORT_6379_TCP_PORT = 0;
}

export const allowedClientKeys: Array<keyof Env> = ['HTTPS_BY_NODE', 'SENTRY_URL'];

// eslint-disable-next-line no-process-env
const envInstance = new Env(process.env);

export const env =
  typeof IS_CLIENT !== 'undefined' && IS_CLIENT
    ? // eslint-disable-next-line no-process-env
      _.pick(envInstance, allowedClientKeys)
    : envInstance;
