import React from 'react';
import loadable from '@loadable/component';
import { autorun, IReactionDisposer } from 'mobx';

import { routesObject } from 'routes';
import { ConnectedComponent } from 'components/ConnectedComponent';

export const routeComponents: Record<
  keyof typeof routesObject,
  { Component: React.ReactElement; props?: Record<string, any> }
> = {
  gallery: {
    Component: loadable(() => import('pages/Gallery')),
  },
  about: {
    Component: loadable(() => import('pages/About')),
  },
  reviews: {
    Component: loadable(() => import('pages/Reviews')),
  },
  editLocalization: {
    Component: loadable(() => import('pages/EditLocalization')),
  },
  error404: {
    Component: loadable(() => import('pages/ErrorPage')),
    props: {
      errorNumber: 404,
    },
  },
  error500: {
    Component: loadable(() => import('pages/ErrorPage')),
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
        ui: { firstRendered },
      },
    } = this.context;

    if (loadedComponentName === currentRoute.name) return;

    const componentConfig = routeComponents[currentRoute.name];

    if (!componentConfig) {
      return console.error(`Router: component for ${currentRoute.name} is not defined`);
    }

    if (IS_CLIENT && firstRendered) {
      return componentConfig.Component.load().then(module =>
        this.updateLoadedComponent(currentRoute.name, module.default, componentConfig.props)
      );
    }

    this.updateLoadedComponent(currentRoute.name, componentConfig.Component, componentConfig.props);
  }

  updateLoadedComponent(name: string, Component: any, props: Record<string, any> = {}) {
    this.setState({
      LoadedComponent: <Component {...props} />,
      loadedComponentName: name,
    });
  }

  render() {
    return this.state.LoadedComponent || null;
  }
}
