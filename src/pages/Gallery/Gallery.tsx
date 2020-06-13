import React from 'react';
import { observable } from 'mobx';

import { Header } from 'components/Header';
import { ConnectedComponent } from 'components/ConnectedComponent';

import { GalleryItem } from './GalleryItem';
import styles from './Gallery.scss';
import { messages } from './messages';

@ConnectedComponent.observer
export class Gallery extends ConnectedComponent {
  UNSAFE_componentWillMount() {
    const { actions } = this.context;

    actions.general.setMetaData({
      title: messages.metaTitle,
      description: messages.metaDescription,
    });
  }

  innerState = observable({ mounted: false });

  componentDidMount() {
    this.innerState.mounted = true;
  }

  handleItemClick = (index: number) => (event: React.MouseEvent) => {
    const {
      actions,
      store: {
        gallery: { items },
        user: { isLoggedIn },
      },
    } = this.context;

    event.preventDefault();

    if (isLoggedIn) {
      return actions.general.modalRaise({
        name: 'ModalUploadImage',
        data: { ...items[index], index, totalItems: items.length },
      });
    }

    return actions.general.changeLightbox({ index, elements: items });
  };

  render() {
    const {
      store,
      actions,
      store: {
        gallery: { items },
        user: { isLoggedIn },
      },
    } = this.context;

    return (
      <>
        <Header />
        {isLoggedIn && (
          <div className={styles.buttonsLine}>
            <div
              className={styles.uploadButton}
              onClick={() => actions.general.modalRaise({ name: 'ModalUploadImage' })}
            >
              {store.getLn(messages.uploadButton)}
            </div>
          </div>
        )}
        {items.length > 0 && (
          <div className={styles.gallery}>
            {items.map((imgData, index) => (
              <GalleryItem key={index} imgData={imgData} onClick={this.handleItemClick(index)} />
            ))}
          </div>
        )}
      </>
    );
  }
}
