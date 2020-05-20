import _ from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';

import { routeComponents } from 'routeComponents';
import { StoreContext } from 'stores/StoreRoot';

@observer
export class Router extends React.Component {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

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
        console.error(`Router: component for ${name} is not defined in routeComponents`);
      }

      return null;
    }

    return Component;
  }
}
