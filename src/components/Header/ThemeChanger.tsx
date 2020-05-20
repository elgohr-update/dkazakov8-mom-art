import _ from 'lodash';
import cn from 'classnames';
import React from 'react';
import { observer } from 'mobx-react';

import { StoreContext } from 'stores/StoreRoot';

import { Icon } from '../Icon';

import styles from './Header.scss';

@observer
export class ThemeChanger extends React.Component {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  render() {
    const {
      store,
      store: {
        ui: { currentTheme, themesList },
      },
    } = this.context;

    return (
      <div className={styles.buttonsBlock}>
        {themesList.map(theme => (
          <Icon
            key={theme}
            glyph={Icon.glyphs[`theme${_.capitalize(theme)}`]}
            className={cn(styles.themeToggler, theme === currentTheme && styles.active)}
            onClick={() => store.actions.common.setTheme({ theme })}
          />
        ))}
      </div>
    );
  }
}
