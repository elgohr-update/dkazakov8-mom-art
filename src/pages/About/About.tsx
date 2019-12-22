import React from 'react';
import ReactMarkdown from 'react-markdown';

import { StoreRoot } from 'stores/StoreRoot';
import { Icon } from 'components/Icon';
import { Header } from 'components/Header';
import { images } from 'assets/images';
import { connectComponent } from 'utils';
import { ConnectedProps } from 'commonUnsafe';

import styles from './About.scss';
import { messages } from './messages';

@connectComponent
export class About extends React.Component<ConnectedProps> {
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
          <div className={styles.socialLineWrapper}>
            <div className={styles.socialLine}>
              <Icon glyph={Icon.glyphs.instagram} className={styles.socialLineIcon} />
              <a
                target="_blank"
                href={store.getLn(messages.instagram)}
                className={styles.socialLineText}
              >
                {store.getLn(messages.instagram).split('/').pop()}
              </a>
            </div>
            <div className={styles.socialLine}>
              <Icon glyph={Icon.glyphs.email} className={styles.socialLineIcon} />
              <a href={store.getLn(messages.email)} className={styles.socialLineText}>
                {store.getLn(messages.email).split(':').pop()}
              </a>
            </div>
          </div>

          <div className={styles.text}>
            <img src={images.photoAbout} className={styles.photo} />
            <ReactMarkdown source={store.getLn(messages.about)} />
          </div>
        </div>
      </>
    );
  }
}
