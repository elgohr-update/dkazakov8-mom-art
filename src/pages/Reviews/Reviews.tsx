import ReactMarkdown from 'react-markdown';
import React from 'react';

import { connectComponent } from 'utils';
import { Header } from 'components/Header';
import { ConnectedProps } from 'commonUnsafe';
import { StoreRoot } from 'stores/StoreRoot';

import styles from './Reviews.scss';
import { messages } from './messages';

@connectComponent
export class Reviews extends React.Component<ConnectedProps> {
  static meta = (store: StoreRoot) => ({
    title: store.getLn(messages.metaTitle),
    description: store.getLn(messages.metaDescription),
  });

  render() {
    const { store } = this.props;

    return (
      <>
        <Header />
        <div className={styles.wrapper}>
          <ReactMarkdown source={store.getLn(messages.reviews)} />
        </div>
      </>
    );
  }
}
