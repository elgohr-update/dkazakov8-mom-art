import './styles/global.scss';

import { hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component';

import { App } from 'components/App';
import { TypeStore } from 'models';
import { StoreRoot } from 'store';
import { initAutorun } from 'autorun';
import { StoreGetters } from 'getters';
import { StoreContext } from 'components/StoreContext';
import { actionsCreator } from 'actionsCreator';
import { measureClient, isomorphPolyfills } from 'utils';

if (performance) {
  performance.mark('headParsed-appScriptEvalStart');
  performance.measure('headParsed-appScriptEvalStart', 'headParsed');
}

isomorphPolyfills();

const store = new StoreRoot() as TypeStore;
const getters = new StoreGetters(store);
const { api, actions, extendActions } = actionsCreator(store);
const contextProps = { store, actions, api, getters, extendActions };

Promise.resolve()
  .then(() => loadableReady())

  .then(measureClient('onStoreInitializedClient'))
  .then(() => actions.general.onStoreInitializedClient())
  .then(measureClient('onStoreInitializedClient'))

  .then(() => initAutorun(contextProps))

  .then(() =>
    hydrate(
      <StoreContext.Provider value={contextProps}>
        <App />
      </StoreContext.Provider>,
      document.getElementById('app')
    )
  );
