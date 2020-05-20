import cn from 'classnames';
import React from 'react';

import { Header } from 'components/Header';
import { StoreContext } from 'stores/StoreRoot';

import styles from './ErrorPage.scss';
import { messages } from './messages';

interface ErrorPageProps {
  errorNumber: number;
}

export class ErrorPage extends React.Component<ErrorPageProps> {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  UNSAFE_componentWillMount() {
    const { store } = this.context;

    store.router.metaData = {
      title: store.getLn(messages.metaTitle),
    };
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
