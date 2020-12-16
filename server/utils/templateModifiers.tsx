import path from 'path';

import { toJS } from 'mobx';
import _ from 'lodash';
import { ReactElement } from 'react';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

import { App } from 'components/App';
import { escapeAllStrings } from 'utils';
import { StoreContext } from 'components/StoreContext';
import { hotReloadUrl, compressions } from 'const';
import { env } from 'env';
import { paths } from 'paths';
import { TypeGlobals } from 'models';

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
  const acceptedEncodings = req.acceptsEncodings();
  const acceptedCompression = env.GENERATE_COMPRESSED
    ? compressions.find(({ encoding }) => acceptedEncodings.includes(encoding))
    : null;

  return !acceptedCompression
    ? str
    : str
        .replace(/(\.js)/g, `$1.${acceptedCompression.extension}`)
        .replace(/(\.css)/g, `$1.${acceptedCompression.extension}`);
}

export function injectAnalytics(str) {
  return str.replace(
    '</head>',
    `
    <!-- Yandex.Metrika counter -->
    <script type="text/javascript" >
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(59188381, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
      });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/59188381" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->
</head>`
  );
}

export function injectMetaTags(str, store, getters) {
  const { description } = store.router.metaData;
  const { pageTitle } = getters;

  return Promise.resolve()
    .then(() => str.replace(`<title></title>`, `<title>${pageTitle}</title>`))
    .then(modStr =>
      modStr.replace(
        `<meta name="description" content="" />`,
        `<meta name="description" content="${description || ''}" />`
      )
    );
}

const webStats = path.resolve(paths.build, 'web-loadable-stats.json');

export function injectAppMarkup(str, contextProps: TypeGlobals) {
  /**
   * Firstly renderToString triggers componentWillMount in all React tree,
   * which may call async actions, so we have to wait until onActionsFinished called
   *
   * Secondly, all actions are mocked and App rerenders using final contextProps.store
   * (that was mutated in those actions)
   *
   * This technique allows to fetch data in ssr-mode in componentWillMount and supports async chunks,
   * the one disadvantage is renderToString called twice. That's current price for comfortable development.
   *
   * If React had async method like ssrBeforeComponentMount, the way could be simpler and save
   * our server some CPU resources
   *
   */

  const webExtractor = new ChunkExtractor({
    statsFile: webStats,
    entrypoints: ['client'],
  });

  return new Promise(resolve => {
    const AppWrapped = (
      <ChunkExtractorManager extractor={webExtractor}>
        <StoreContext.Provider value={contextProps}>
          <App onActionsFinished={() => resolve(AppWrapped)} />
        </StoreContext.Provider>
      </ChunkExtractorManager>
    );

    renderToString(AppWrapped);
  }).then((AppWrapped: ReactElement) =>
    str
      .replace(`<div id="app"></div>`, `<div id="app">${renderToString(AppWrapped)}</div>`)
      .replace(
        '<!-- LINKS -->',
        [webExtractor.getLinkTags(), webExtractor.getStyleTags()].join('\n')
      )
      .replace('<!-- SCRIPTS -->', webExtractor.getScriptTags())
  );
}

export function injectBrowserReload(str) {
  return str.replace('</body>', `<script src="${hotReloadUrl}"></script></body>`);
}

export function injectInitialStoreData(str, store) {
  const storeObjectFiltered = filterStore(store);
  const storeObjectJS = _.mapValues(storeObjectFiltered, v => toJS(v));
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
