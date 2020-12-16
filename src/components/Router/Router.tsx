/**
 * @docs: https://loadable-components.com/docs/getting-started
 *
 */

import { autorun, IReactionDisposer } from 'mobx';
import loadable from '@loadable/component';

import { routes } from 'routes';
import { ConnectedComponent } from 'components/ConnectedComponent';

/**
 * loadable-components supports loadable(() => import) constructions only in file it is used.
 * So shame, it would be better to have all routes config in one file, but not here in React component,
 * because it may be imported in actions or store, but they should not know about View layer
 *
 */

export const routesObject: Record<keyof typeof routes, any> = {
  gallery: {
    loader: loadable(() => import('pages/Gallery')),
  },
  about: {
    loader: loadable(() => import('pages/About')),
  },
  reviews: {
    loader: loadable(() => import('pages/Reviews')),
  },
  editLocalization: {
    loader: loadable(() => import('pages/EditLocalization')),
  },
  error404: {
    loader: loadable(() => import('pages/ErrorPage')),
    props: {
      errorNumber: 404,
    },
  },
  error500: {
    loader: loadable(() => import('pages/ErrorPage')),
    props: {
      errorNumber: 500,
    },
  },
};

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
        ui,
      },
    } = this.context;

    if (loadedComponentName === currentRoute.name) return;

    const componentConfig = routesObject[currentRoute.name];

    /**
     * Client app should not try to load initial chunks, they are already included
     * in page markup by SSR
     *
     * Manual loading by load() allows to update page component after full loading to prevent
     * fallback-component or page flash happen
     *
     * TODO: handle network error
     *
     */

    if (IS_CLIENT && ui.firstRendered) {
      return componentConfig.loader.load().then(config => {
        this.updateLoadedComponent(
          currentRoute.name,
          // @ts-ignore
          config.default,
          'props' in componentConfig ? componentConfig.props : {}
        );
      });
    }

    /**
     * SSR does not support load() method so have to render componentConfig.loader HOC
     *
     */

    return this.updateLoadedComponent(
      currentRoute.name,
      componentConfig.loader,
      'props' in componentConfig ? componentConfig.props : {}
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
