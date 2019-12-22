import cn from 'classnames';
import React from 'react';

import { ConnectedProps } from 'commonUnsafe';
import { StoreRoot } from 'stores/StoreRoot';
import { connectComponent } from 'utils';
import { Header } from 'components/Header';

import styles from './ErrorPage.scss';
import { messages } from './messages';

interface ErrorPageProps {
  errorNumber: number;
}

@connectComponent
export class ErrorPage extends React.Component<ConnectedProps & ErrorPageProps> {
  static meta = (store: StoreRoot) => ({
    title: store.getLn(messages.metaTitle),
  });

  render() {
    const { store, errorNumber } = this.props;

    return (
      <>
        <Header />
        <div className={styles.wrapper}>
          <div className={styles.textContainer}>
            <div className={styles.errorTitle}>{errorNumber}</div>
            <div className={styles.errorSubtitle}>
              {store.getLn(messages[`error${errorNumber}Title`])}
            </div>
            <div className={styles.errorReason}>
              {store.getLn(messages[`error${errorNumber}Subtitle`])}
            </div>
          </div>
          {[...Array(5)].map((empty, index) => (
            <div key={index} className={cn(styles.cloudWrapper, styles[`x${index}`])}>
              <div className={cn(styles.cloud, styles[`x${index}`])} />
            </div>
          ))}
        </div>
      </>
    );
  }
}
