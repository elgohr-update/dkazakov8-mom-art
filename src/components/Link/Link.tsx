import React from 'react';

import { connectComponent } from 'utils';
import { RouteType } from 'common';
import { ConnectedProps } from 'commonUnsafe';

interface LinkProps {
  route: RouteType;
  onClick?: (event?: Event) => void;
}

@connectComponent
export class Link extends React.Component<ConnectedProps & LinkProps> {
  render() {
    const { store, route, onClick, children, ...otherProps } = this.props;

    return (
      <a
        href={`/${store.ui.currentLanguage}${route.path}`}
        onClick={event => {
          /**
           * Replace default onClick handler if one is passed in props
           *
           */
          if (onClick) {
            return onClick(event);
          }

          event.preventDefault();

          store.actions.common.redirectTo({ route });
        }}
        {...otherProps}
      >
        {children}
      </a>
    );
  }
}
