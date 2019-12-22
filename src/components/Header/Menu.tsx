import cn from 'classnames';
import React from 'react';

import { connectComponent } from 'utils';
import { routes } from 'routes';
import { Link } from 'components/Link';
import { ConnectedProps } from 'commonUnsafe';

import styles from './Header.scss';
import { messages } from './messages';

const menuArray = [
  {
    title: messages.menuGallery,
    route: routes.gallery,
  },
  {
    title: messages.menuAbout,
    route: routes.about,
  },
  {
    title: messages.menuReviews,
    route: routes.reviews,
  },
  {
    title: messages.menuLocalization,
    route: routes.editLocalization,
  },
];

@connectComponent
export class Menu extends React.Component<ConnectedProps> {
  render() {
    const {
      store,
      store: {
        router: { currentRoute },
        user,
      },
    } = this.props;

    return (
      <div className={styles.menu}>
        {menuArray
          .filter(({ route }) => !route.rights || (route.rights === 'admin' && user.isLoggedIn))
          .map(({ title, route }) => {
            const isActive = currentRoute.name === route.name;

            return (
              <Link
                key={route.name}
                className={cn(styles.menuItem, isActive && styles.active)}
                route={route}
              >
                {store.getLn(title)}
              </Link>
            );
          })}
      </div>
    );
  }
}
