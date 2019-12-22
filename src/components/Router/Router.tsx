import _ from 'lodash';
import React from 'react';

import { connectComponent } from 'utils';
import { routeComponents } from 'routeComponents';
import { ConnectedProps } from 'commonUnsafe';

@connectComponent
export class Router extends React.Component<ConnectedProps> {
  render() {
    const {
      store: {
        router: {
          currentRoute: { name },
        },
      },
    } = this.props;

    const Component = _.get(routeComponents, `${name}.Component`);

    if (!Component) {
      if (typeof Component === 'undefined') {
        console.error(`Router: component for ${name} is not defined in routeComponents`);
      }

      return null;
    }

    return Component;
  }
}
