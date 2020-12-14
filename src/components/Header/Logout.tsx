import { Icon } from 'components/Icon';
import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from './Header.scss';

@ConnectedComponent.observer
export class Logout extends ConnectedComponent {
  render() {
    const {
      actions,
      store: {
        user: { isLoggedIn },
      },
    } = this.context;

    return (
      <Icon
        className={styles.logoutIcon}
        glyph={isLoggedIn ? Icon.glyphs.logout : Icon.glyphs.auth}
        onClick={() =>
          isLoggedIn ? actions.general.logout() : actions.general.modalRaise({ name: 'ModalAuth' })
        }
      />
    );
  }
}
