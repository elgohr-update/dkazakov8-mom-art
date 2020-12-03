import _ from 'lodash';
import React from 'react';

import { routes } from 'routes';
import { ConnectedComponent } from 'components/ConnectedComponent';
import { Gallery, ErrorPage, About, Reviews, EditLocalization } from 'pages';

export const routeComponents: Record<keyof typeof routes, { Component: React.ReactElement }> = {
  gallery: {
    Component: <Gallery />,
  },
  about: {
    Component: <About />,
  },
  reviews: {
    Component: <Reviews />,
  },
  editLocalization: {
    Component: <EditLocalization />,
  },
  error404: {
    Component: <ErrorPage errorNumber={404} />,
  },
  error500: {
    Component: <ErrorPage errorNumber={500} />,
  },
};

@ConnectedComponent.observer
export class Router extends ConnectedComponent {
  render() {
    const {
      store: {
        router: {
          currentRoute: { name },
        },
      },
    } = this.context;

    const Component = _.get(routeComponents, `${name}.Component`);

    if (!Component) {
      if (typeof Component === 'undefined') {
        console.error(`Router: component for ${name} is not defined`);
      }

      return null;
    }

    return Component;
  }
}
