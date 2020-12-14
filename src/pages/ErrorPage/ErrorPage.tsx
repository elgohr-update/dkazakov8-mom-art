import cn from 'classnames';
import React from 'react';

import { Header } from 'components/Header';
import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from './ErrorPage.scss';
import { messages } from './messages';

interface ErrorPageProps {
  errorNumber: number;
}

@ConnectedComponent.observer
export default class ErrorPage extends ConnectedComponent<ErrorPageProps> {
  UNSAFE_componentWillMount() {
    const { actions } = this.context;

    actions.general.setMetaData({
      title: messages.metaTitle,
      description: messages.metaTitle,
    });
  }

  render() {
    const { store } = this.context;
    const { errorNumber } = this.props;

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
