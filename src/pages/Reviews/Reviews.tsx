import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Header } from 'components/Header';
import { StoreContext } from 'stores/StoreRoot';

import styles from './Reviews.scss';
import { messages } from './messages';

export class Reviews extends React.Component {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  UNSAFE_componentWillMount() {
    const { store } = this.context;

    store.router.metaData = {
      title: store.getLn(messages.metaTitle),
      description: store.getLn(messages.metaDescription),
    };
  }

  render() {
    const { store } = this.context;

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
