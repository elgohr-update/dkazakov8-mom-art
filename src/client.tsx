import './styles/global.scss';

import React from 'react';
import { hydrate } from 'react-dom';

import { App } from 'components/App';
import { StoreRoot, StoreContext } from 'stores/StoreRoot';
import { initAutorun } from 'autorun';
import { measureClient, isomorphPolyfills } from 'utils';

if (performance) {
  performance.mark('headParsed-appScriptEvalStart');
  performance.measure('headParsed-appScriptEvalStart', 'headParsed');
}

isomorphPolyfills();

let store: StoreRoot;

Promise.resolve()
  .then(measureClient('createStore'))
  .then(() => (store = new StoreRoot({})))
  .then(measureClient('createStore'))

  .then(measureClient('onStoreInitializedClient'))
  .then(() => store.actions.common.onStoreInitializedClient())
  .then(measureClient('onStoreInitializedClient'))

  .then(() => initAutorun(store))

  .then(() => {
    return hydrate(
      <StoreContext.Provider value={{ store }}>
        <App />
      </StoreContext.Provider>,
      document.getElementById('app')
    );
  });
