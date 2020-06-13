import _ from 'lodash';
import { toJS, configure } from 'mobx';

import { errorsNames } from 'const';

import { env } from '../../env';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sentry = require(IS_CLIENT ? '@sentry/browser' : '@sentry/node');

function initSentry() {
  if (env.SENTRY_URL) {
    Sentry.init({
      dsn: env.SENTRY_URL,
    });
  }
}

function createConsoleJsLogger() {
  console.js = function consoleJsCustom(...args) {
    console.log(...args.map(arg => toJS(arg)));
  };
}

function replaceOriginalErrorLogger() {
  const originalErrorLogger = console.error;
  console.error = function consoleErrorCustom(...args: any[]) {
    const errorName = _.get(args, '[0].name');
    const errorIsSilent = errorName === errorsNames.SILENT;

    // Do not log silent errors to console or Sentry
    if (errorIsSilent) return false;

    if (env.SENTRY_URL) {
      Sentry.captureException(...args);
    }

    return originalErrorLogger(...args);
  };
}

export function isomorphPolyfills() {
  configure({
    enforceActions: 'always',
    disableErrorBoundaries: false,
    computedRequiresReaction: false,
    reactionRequiresObservable: true,
    observableRequiresReaction: false,
  });
  initSentry();
  createConsoleJsLogger();
  replaceOriginalErrorLogger();
}
