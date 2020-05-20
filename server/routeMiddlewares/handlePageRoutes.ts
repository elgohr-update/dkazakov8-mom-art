import fs from 'fs';
import path from 'path';

import { errorsNames } from 'const';
import { createMeasure } from 'utils';
import {
  injectMetaTags,
  injectMeasures,
  injectAppMarkup,
  injectCompressed,
  injectCSPProtection,
  injectBrowserReload,
  injectThemeProperties,
  injectInitialStoreData,
} from 'serverUtils';
import { StoreRoot } from 'stores/StoreRoot';

import { env } from '../../env';

const template = fs.readFileSync(path.resolve(__dirname, '../../build/template.html'), 'utf-8');

export function handlePageRoutes(app) {
  app.get('*', (req, res) => {
    /**
     * Create clear store for each request
     *
     */
    let store = null;
    const measure = createMeasure();

    Promise.resolve()
      .then(measure.wrap('createStore'))
      .then(() => (store = new StoreRoot({ req, res })))
      .then(measure.wrap('createStore'))

      .then(measure.wrap('onStoreInitializedServer'))
      .then(() => store.actions.common.onStoreInitializedServer({ req, res }))
      .then(measure.wrap('onStoreInitializedServer'))

      .then(measure.wrap('injectAppMarkup'))
      .then(() => injectAppMarkup(template, store))
      .then(measure.wrap('injectAppMarkup'))

      .then(measure.wrap('injectOtherData'))
      .then(modTemplate => injectMetaTags(modTemplate, store))
      .then(modTemplate => injectCompressed(req, modTemplate))
      .then(modTemplate => injectCSPProtection(modTemplate, res))
      .then(modTemplate => injectThemeProperties(modTemplate, store))
      .then(modTemplate => injectInitialStoreData(modTemplate, store))
      .then(modTemplate => (env.HOT_RELOAD ? injectBrowserReload(modTemplate) : modTemplate))
      .then(measure.wrap('injectOtherData'))

      .then(modTemplate => injectMeasures(modTemplate, { server: measure.getMeasures() }))
      .then(modTemplate => res.send(modTemplate))
      .catch(error => {
        /**
         * SILENT & REDIRECT errors are predictable, no logging
         *
         */

        if (error.name === errorsNames.SILENT) {
          return Promise.resolve();
        } else if (error.name === errorsNames.REDIRECT) {
          console.log('redirect', error.message);

          return res.redirect(error.message);
        }

        /**
         * Errors here are destroying: they may come from creating new store
         * or rendering page to markup, so no chance to draw beautiful error page.
         *
         * TODO?: create static html page for this case
         *
         */

        console.error(error);

        res.status(500);
        res.send('Unpredictable error');
      });
  });
}
