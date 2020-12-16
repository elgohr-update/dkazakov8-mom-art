import { ReactElement } from 'react';
import { autorun, IReactionDisposer } from 'mobx';

import { TypeStore } from 'models';
import { routes } from 'routes';
import { ConnectedComponent } from 'components/ConnectedComponent';

export class Router extends ConnectedComponent {
  state = {
    LoadedComponent: null,
    loadedComponentName: null,
  };
  componentChangeDisposer: IReactionDisposer;

  UNSAFE_componentWillMount() {
    const {
      store: {
        router: { currentRoute },
      },
    } = this.context;

    this.componentChangeDisposer = autorun(() => {
      if (currentRoute.name) this.setLoadedComponent();
    });
  }

  componentWillUnmount() {
    this.componentChangeDisposer();
  }

  setLoadedComponent() {
    /**
     * Loads async components before rendering for disabling page flash
     *
     */

    const { loadedComponentName } = this.state;
    const {
      store: {
        router: { currentRoute },
        setStores,
      },
    } = this.context;

    if (loadedComponentName === currentRoute.name) return;

    const componentConfig = routes[currentRoute.name];

    return (
      componentConfig.loader
        .load()
        // @ts-ignore (format of default export of pages is controlled by conventions)
        .then((config: { default: { stores?: TypeStore; Component: ReactElement } }) => {
          if (config.default.stores) setStores(config.default.stores);

          this.updateLoadedComponent(
            currentRoute.name,
            config.default.Component,
            'props' in componentConfig ? componentConfig.props : {}
          );
        })
    );
  }

  updateLoadedComponent(name: string, Component: any, props: Record<string, any>) {
    this.setState({
      LoadedComponent: <Component {...props} />,
      loadedComponentName: name,
    });
  }

  render() {
    return this.state.LoadedComponent || null;
  }
}
