import _ from 'lodash';
import cn from 'classnames';
import React from 'react';

import { connectComponent } from 'utils';
import { ConnectedProps } from 'commonUnsafe';

import { Icon } from '../Icon';

import styles from './Header.scss';

@connectComponent
export class ThemeChanger extends React.Component<ConnectedProps> {
  render() {
    const {
      store,
      store: {
        ui: { currentTheme, themesList },
      },
    } = this.props;

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
