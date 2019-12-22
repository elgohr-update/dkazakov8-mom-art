import React from 'react';

import { Icon } from 'components/Icon';
import { ModalsCollection } from 'components/ModalsCollection';
import { connectComponent } from 'utils';
import { ConnectedProps } from 'commonUnsafe';

import { Menu } from './Menu';
import { LangChanger } from './LangChanger';
import { ThemeChanger } from './ThemeChanger';
import styles from './Header.scss';
import { messages } from './messages';

@connectComponent
export class Header extends React.Component<ConnectedProps> {
  render() {
    const {
      store,
      store: {
        user: { isLoggedIn },
      },
    } = this.props;

    return (
      <div className={styles.header}>
        <div className={styles.topRightBlock}>
          <LangChanger />
          <ThemeChanger />
          <Icon
            glyph={isLoggedIn ? Icon.glyphs.logout : Icon.glyphs.auth}
            onClick={() =>
              isLoggedIn
                ? store.actions.common.logout()
                : store.actions.common.raiseModal({ name: ModalsCollection.ModalAuth.name })
            }
            className={styles.logout}
          />
        </div>
        <div className={styles.title}>{store.getLn(messages.artistName)}</div>
        <Menu />
      </div>
    );
  }
}
