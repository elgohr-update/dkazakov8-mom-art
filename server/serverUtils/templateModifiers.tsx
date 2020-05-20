import { toJS } from 'mobx';
import React from 'react';

import { App } from 'components/App';
import { escapeAllStrings } from 'utils';
import { StoreContext } from 'stores/StoreRoot';

import { env } from '../../env';

import { hotReloadUrl } from './hotReloadUrl';

const isReactMode = env.REACT_LIBRARY === 'react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { renderToString } = require(isReactMode ? 'react-dom/server' : 'serverLib/infernoServer');

function filterStore(store) {
  const excludedStores = ['actions', 'executions', 'getLn', 'proxy'];

  return Object.keys(store)
    .filter(storeName => !excludedStores.includes(storeName))
    .reduce(
      (obj, storeName) => ({
        ...obj,
        [storeName]: store[storeName],
      }),
      {}
    );
}

export function injectCompressed(req, str) {
  const compressions = [
    {
      encoding: 'br',
      extension: 'br',
    },
    {
      encoding: 'gzip',
      extension: 'gz',
    },
  ];

  const acceptedEncodings = req.acceptsEncodings();

  const acceptedCompression = env.GENERATE_COMPRESSED
    ? compressions.find(({ encoding }) => acceptedEncodings.indexOf(encoding) !== -1)
    : null;

  if (!acceptedCompression) return str;

  let scriptsStr = str.slice(str.indexOf('<body>'));
  scriptsStr = scriptsStr.slice(scriptsStr.indexOf('<script'));
  scriptsStr = scriptsStr.substr(0, scriptsStr.indexOf('</body>'));

  let stylesStr = str.slice(str.indexOf('<link'));
  stylesStr = stylesStr.substr(0, stylesStr.indexOf('>'));

  return str
    .replace(scriptsStr, scriptsStr.replace(/\.js/g, `.js.${acceptedCompression.extension}`))
    .replace(stylesStr, stylesStr.replace(/\.css/g, `.css.${acceptedCompression.extension}`));
}

export function injectMetaTags(str, store) {
  const { description } = store.router.metaData;
  const { pageTitle } = store.getters;

  return Promise.resolve()
    .then(() => str.replace(`<title></title>`, `<title>${pageTitle}</title>`))
    .then(modStr =>
      modStr.replace(
        `<meta name="description" content="" />`,
        `<meta name="description" content="${description || ''}" />`
      )
    );
}

export function injectAppMarkup(str, store) {
  const appMarkup = renderToString(
    <StoreContext.Provider value={{ store }}>
      <App />
    </StoreContext.Provider>
  );

  return str.replace(`<div id="app"></div>`, `<div id="app">${appMarkup || ''}</div>`);
}

export function injectBrowserReload(str) {
  return str.replace('</body>', `<script src="${hotReloadUrl}"></script></body>`);
}

export function injectInitialStoreData(str, store) {
  const storeObjectFiltered = filterStore(store);
  const storeObjectJS = toJS(storeObjectFiltered, { recurseEverything: true });
  const storeObjectEscaped = escapeAllStrings(storeObjectJS);
  const storeObjectString = JSON.stringify(storeObjectEscaped);

  return str.replace(
    '</head>',
    `
    <script type="text/javascript">
window.INITIAL_DATA = ${storeObjectString};
    </script>
  </head>`
  );
}

export function injectThemeProperties(str, store) {
  return str.replace(
    '<html>',
    `<html style="${JSON.stringify(store.ui.themeParams)
      .replace(/[{"}]/g, '')
      .replace(/,-/g, ';-')}">`
  );
}

export function injectMeasures(str, measures) {
  return str.replace(
    '</head>',
    `  <script type="text/javascript">
window.MEASURES = '${JSON.stringify(measures)}';
    </script>
  </head>`
  );
}
