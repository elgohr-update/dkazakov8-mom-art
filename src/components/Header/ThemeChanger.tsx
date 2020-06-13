import cn from 'classnames';
import React from 'react';

import { ConnectedComponent } from 'components/ConnectedComponent';

import { Icon } from '../Icon';

import styles from './Header.scss';

@ConnectedComponent.observer
export class ThemeChanger extends ConnectedComponent {
  setNextColorScheme = () => {
    const {
      actions,
      store: {
        ui: { currentTheme, themesList },
      },
    } = this.context;

    // eslint-disable-next-line prefer-destructuring
    const nextColorTheme = themesList.filter(theme => theme !== currentTheme)[0];

    actions.general.setTheme({
      theme: nextColorTheme,
    });
  };

  render() {
    const {
      store: {
        ui: { currentTheme },
      },
    } = this.context;

    const isDarkScheme = currentTheme === 'dark';

    return (
      <div className={styles.themeChanger}>
        <div
          className={cn(styles.themeSwitcher, isDarkScheme && styles.active)}
          onClick={this.setNextColorScheme}
        />
        <Icon
          glyph={isDarkScheme ? Icon.glyphs.themeLight : Icon.glyphs.themeDark}
          className={styles.themeIcon}
          onClick={this.setNextColorScheme}
        />
      </div>
    );
  }
}
