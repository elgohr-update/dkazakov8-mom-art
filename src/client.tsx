import './styles/global.scss';

import { hydrate } from 'react-dom';
import { Provider } from 'mobx-react';
import React from 'react';

import { measureClient, isomorphPolyfills } from 'utils';
import { App } from 'components/App';
import { StoreRoot } from 'stores/StoreRoot';
import { initAutorun } from 'autorun';

if (performance) {
  performance.mark('headParsed-appScriptEvalStart');
  performance.measure('headParsed-appScriptEvalStart', 'headParsed');
}

isomorphPolyfills();

let store: StoreRoot = null;

Promise.resolve()
  .then(measureClient('createStore'))
  .then(() => (store = new StoreRoot({})))
  .then(measureClient('createStore'))

  .then(measureClient('onStoreInitializedClient'))
  .then(() => store.actions.common.onStoreInitializedClient())
  .then(measureClient('onStoreInitializedClient'))

  .then(() => initAutorun(store))

  .then(() =>
    hydrate(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('app')
    )
  );
