import cn from 'classnames';
import React from 'react';

import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from './Footer.scss';
import { messages } from './messages';

interface FooterProps {
  className?: string;
}

@ConnectedComponent.observer
export class Footer extends ConnectedComponent<FooterProps> {
  render() {
    const { store } = this.context;
    const { className } = this.props;

    const currentYear = new Date().getFullYear();

    return (
      <div className={cn(styles.footer, className)}>
        {currentYear}&nbsp;©&nbsp;{store.getLn(messages.footerText)}
      </div>
    );
  }
}
