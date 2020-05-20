import React from 'react';
import { observer } from 'mobx-react';

import { RouteType } from 'models';
import { StoreContext } from 'stores/StoreRoot';

interface LinkProps {
  route: RouteType;
  onClick?: (event?: React.MouseEvent) => void;
  className?: string;
}

@observer
export class Link extends React.Component<LinkProps> {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  render() {
    const { store } = this.context;
    const { route, onClick, className, children } = this.props;

    return (
      <a
        href={`/${store.ui.currentLanguage}${route.path}`}
        className={className}
        onClick={event => {
          /**
           * Replace default onClick handler if one is passed in props
           *
           */
          if (onClick) return onClick(event);

          event.preventDefault();

          store.actions.common.redirectTo({ route });
        }}
      >
        {children}
      </a>
    );
  }
}
