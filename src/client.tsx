import './styles/global.scss';

import React from 'react';
import { hydrate } from 'react-dom';

import { App } from 'components/App';
import { StoreRoot } from 'stores/StoreRoot';
import { StoreGetters } from 'stores/StoreGetters';
import { StoreContext } from 'components/StoreContext';
import { initAutorun } from 'autorun';
import { actionsCreator } from 'actionsCreator';
import { measureClient, isomorphPolyfills } from 'utils';

if (performance) {
  performance.mark('headParsed-appScriptEvalStart');
  performance.measure('headParsed-appScriptEvalStart', 'headParsed');
}

isomorphPolyfills();

const store = new StoreRoot();
const { api, actions } = actionsCreator(store);
const getters = new StoreGetters(store);

Promise.resolve()
  .then(measureClient('onStoreInitializedClient'))
  .then(() => actions.general.onStoreInitializedClient())
  .then(measureClient('onStoreInitializedClient'))

  .then(() => initAutorun({ store, actions, api, getters }))

  .then(() => {
    return hydrate(
      <StoreContext.Provider value={{ store, actions, api, getters }}>
        <App />
      </StoreContext.Provider>,
      document.getElementById('app')
    );
  });
