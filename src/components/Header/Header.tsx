import React from 'react';
import cn from 'classnames';
import { IReactionDisposer, action, reaction } from 'mobx';

import { ConnectedComponent } from 'components/ConnectedComponent';
import { Icon } from 'components/Icon';

import { Menu } from './Menu';
import { Logo } from './Logo';
import { Logout } from './Logout';
import { LangChanger } from './LangChanger';
import { ThemeChanger } from './ThemeChanger';
import styles from './Header.scss';

@ConnectedComponent.observer
export class Header extends ConnectedComponent {
  headerElement: HTMLElement;
  screenResizeDisposer: IReactionDisposer;

  componentDidMount() {
    const { store } = this.context;

    this.onScreenResize();
    this.screenResizeDisposer = reaction(
      () => [store.ui.isMobile],
      () => setTimeout(this.onScreenResize, 0)
    );
  }

  componentWillUnmount() {
    this.screenResizeDisposer();
  }

  @action
  onScreenResize = () => {
    const { store } = this.context;

    store.ui.heights.header = this.headerElement.offsetHeight;
  };

  get wrapperClassName() {
    const { store } = this.context;

    return cn({
      [styles.header]: true,
      [styles.isMobile]: store.ui.isMobile,
    });
  }

  render() {
    const { store, actions } = this.context;

    return (
      <div className={this.wrapperClassName} ref={node => (this.headerElement = node)}>
        {store.ui.isMobile && (
          <Icon
            className={styles.burgerIcon}
            glyph={store.ui.headerMenuOpened ? Icon.glyphs.close : Icon.glyphs.burger}
            onClick={() => actions.general.headerToggleMobileMenu({})}
          />
        )}
        <Logo />
        <div className={cn(styles.menuWrapper, !store.ui.headerMenuOpened && styles.closed)}>
          <Menu />
          <LangChanger />
          <ThemeChanger />
        </div>
        <Logout />
      </div>
    );
  }
}
