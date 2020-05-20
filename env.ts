type Devtool =
  | 'eval'
  | 'source-map'
  | 'eval-source-map'
  | 'cheap-source-map'
  | 'inline-source-map'
  | 'hidden-source-map'
  | 'nosources-source-map'
  | 'cheap-eval-source-map'
  | 'cheap-module-source-map'
  | 'inline-cheap-source-map'
  | 'cheap-module-eval-source-map'
  | 'inline-cheap-module-source-map'
  | boolean;

class Env {
  envParams: Record<string, any>;

  getParam(param) {
    return (this.envParams[param] || '').replace(/"/g, '');
  }

  getParamAsNumber(param) {
    return Number(this.getParam(param) || 0);
  }

  getParamAsBoolean(param) {
    return this.getParam(param) === 'true';
  }

  constructor(params) {
    this.envParams = params;

    Object.entries(this.envParams).forEach(([envKey, envValue]) => {
      const paramType = typeof this[envKey];

      if (paramType === 'boolean') this[envKey] = envValue === true || envValue === 'true';
      else if (paramType === 'string') this[envKey] = (envValue || '').replace(/"/g, '').trim();
      else if (paramType === 'number') this[envKey] = Number(envValue || 0);
    });
  }

  SENTRY_URL = '';
  GIT_COMMIT = '';
  NODE_ENV: `development` | `production` = `development`;
  REACT_LIBRARY: `react` | `inferno` = `react`;
  HOT_RELOAD = false;
  HOT_RELOAD_PORT = 0;
  HOT_RELOAD_CLIENT_URL = '';
  USE_TS_LOADER = false;
  POLYFILLING = false;
  DROP_CONSOLE = false;
  FILENAME_HASH = false;
  CIRCULAR_CHECK = false;
  SPEED_ANALYZER = false;
  BUNDLE_ANALYZER = false;
  MINIMIZE_CLIENT = false;
  MINIMIZE_SERVER = false;
  AGGREGATION_TIMEOUT = 0;
  GENERATE_COMPRESSED = false;
  BUNDLE_ANALYZER_PORT = 0;
  SPEED_ANALYZER_SERVER = false;
  START_SERVER_AFTER_BUILD = false;
  DEV_TOOL: Devtool = 'cheap-module-eval-source-map';
  DEV_TOOL_SERVER: Devtool = 'cheap-module-eval-source-map';
  NODE_PATH = '';
  HTTPS_BY_NODE = false;
  EXPRESS_PORT = 0;
  SESSION_DURATION = 0;
  ALLOWED_EMAILS = '';
  SESSION_SECRET = '';
  YANDEX_STORAGE_ENABLED = false;
  LOGS_YANDEX_STORAGE = false;
  YANDEX_STORAGE_BUCKET = '';
  YANDEX_STORAGE_ENDPOINT = '';
  YANDEX_STORAGE_COPY_TO_PROD = false;
  YANDEX_STORAGE_BUCKET_PREFIX = '';
  YANDEX_STORAGE_ACCESS_KEY_ID = '';
  YANDEX_STORAGE_SECRET_ACCESS_KEY = '';

  LOGS_GENERATE_FILES = false;
  LOGS_WATCHED_FILES = false;

  REDIS_PORT_6379_TCP_ADDR = '';
  REDIS_PORT_6379_TCP_PORT = 0;
}

// eslint-disable-next-line no-process-env
export const env = new Env(process.env);
