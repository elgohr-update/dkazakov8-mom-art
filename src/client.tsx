import './styles/global.scss';

import { hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component';

import { App } from 'components/App';
import { StoreRoot } from 'stores/StoreRoot';
import { initAutorun } from 'autorun';
import { StoreGetters } from 'stores/StoreGetters';
import { StoreContext } from 'components/StoreContext';
import { actionsCreator } from 'actionsCreator';
import { measureClient, isomorphPolyfills } from 'utils';

if (performance) {
  performance.mark('headParsed-appScriptEvalStart');
  performance.measure('headParsed-appScriptEvalStart', 'headParsed');
}

isomorphPolyfills();

const store = new StoreRoot();
const getters = new StoreGetters(store);
const { api, actions } = actionsCreator(store);
const contextProps = { store, actions, api, getters };

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
