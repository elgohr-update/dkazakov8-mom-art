import { MouseEvent } from 'react';

import { RouteType, routes } from 'routes';
import { ConnectedComponent } from 'components/ConnectedComponent';

interface LinkProps {
  route: RouteType<keyof typeof routes>;
  onClick?: (event?: MouseEvent) => void;
  className?: string;
}

@ConnectedComponent.observer
export class Link extends ConnectedComponent<LinkProps> {
  render() {
    const { store, actions } = this.context;
    const { route, onClick, className, children } = this.props;

    return (
      <a
        href={`/${store.ui.currentLanguage}${route.path}`}
        className={className}
        onClick={event => {
          event.preventDefault();

          if (onClick) onClick(event);

          actions.general.redirectTo({ route });
        }}
      >
        {children}
      </a>
    );
  }
}
