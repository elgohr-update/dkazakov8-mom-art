import _ from 'lodash';
import { toJS } from 'mobx';

import { errorsNames } from 'const';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sentry = require(IS_CLIENT ? '@sentry/browser' : '@sentry/node');

function initSentry() {
  if (SENTRY_URL) {
    Sentry.init({
      dsn: SENTRY_URL,
    });
  }
}

function createConsoleJsLogger() {
  console.js = function consoleJsCustom(...args) {
    console.log(...args.map(arg => toJS(arg, { recurseEverything: true })));
  };
}

function replaceOriginalErrorLogger() {
  const originalErrorLogger = console.error;
  console.error = function consoleErrorCustom(...args: any[]) {
    const errorName = _.get(args, '[0].name');
    const errorIsSilent = errorName === errorsNames.SILENT;

    // Do not log silent errors to console or Sentry
    if (errorIsSilent) return false;

    if (SENTRY_URL) {
      Sentry.captureException(...args);
    }

    return originalErrorLogger(...args);
  };
}

export function isomorphPolyfills() {
  initSentry();
  createConsoleJsLogger();
  replaceOriginalErrorLogger();
}
