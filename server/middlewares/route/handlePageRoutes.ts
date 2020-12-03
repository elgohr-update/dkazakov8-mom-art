import fs from 'fs';
import path from 'path';

import {
  injectMetaTags,
  injectMeasures,
  injectAnalytics,
  injectAppMarkup,
  injectCompressed,
  injectBrowserReload,
  injectThemeProperties,
  injectInitialStoreData,
} from 'Server/utils';

import { paths } from 'paths';
import { errorsNames } from 'const';
import { createMeasure } from 'utils';
import { StoreRoot } from 'stores/StoreRoot';
import { StoreGetters } from 'stores/StoreGetters';
import { actionsCreator } from 'actionsCreator';
import { env } from 'env';

const template = fs.readFileSync(path.resolve(paths.build, 'template.html'), 'utf-8');

export function handlePageRoutes(app) {
  app.get('*', (req, res) => {
    /**
     * Create clear store for each request
     *
     */
    const store = new StoreRoot();
    const measure = createMeasure();
    const { api, actions } = actionsCreator(store, req, res);
    const getters = new StoreGetters(store);

    Promise.resolve()
      .then(measure.wrap('onStoreInitializedServer'))
      .then(() => actions.general.onStoreInitializedServer({ req, res }))
      .then(measure.wrap('onStoreInitializedServer'))

      .then(measure.wrap('injectAppMarkup'))
      .then(() => injectAppMarkup(template, store, api, actions, getters))
      .then(measure.wrap('injectAppMarkup'))

      .then(measure.wrap('injectOtherData'))
      .then(modTemplate => injectMetaTags(modTemplate, store, getters))
      .then(modTemplate => injectAnalytics(modTemplate))
      .then(modTemplate => injectCompressed(req, modTemplate))
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
