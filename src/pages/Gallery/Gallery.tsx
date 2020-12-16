import { MouseEvent } from 'react';
import Scrollbar from 'react-scrollbars-custom';

import { gallery } from 'const';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Icon } from 'components/Icon';
import { ConnectedComponent } from 'components/ConnectedComponent';

import { GalleryItem } from './GalleryItem';
import { messages } from './messages';
import styles from './Gallery.scss';
import { StoreGallery } from './stores/StoreGallery';

@ConnectedComponent.observer
class Gallery extends ConnectedComponent {
  refGallery: HTMLElement;
  instanceScroll: HTMLElement;

  UNSAFE_componentWillMount() {
    const { actions } = this.context;

    actions.general.setMetaData({
      title: messages.metaTitle,
      description: messages.metaDescription,
    });

    actions.general.getImages();
  }

  handleItemClick = (index: number) => (event: MouseEvent) => {
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

    const wrapperHeight = store.ui.firstRendered
      ? store.ui.screen.height - store.ui.heights.header
      : 0;
    const imagesInRow = this.refGallery
      ? Math.ceil(this.refGallery.offsetWidth / gallery.WIDTH_SMALL)
      : 2;
    const imagePercentWidth = `${100 / imagesInRow}%`;

    const galleryNode = (
      <div className={styles.gallery} ref={node => (this.refGallery = node)}>
        {items.map((imgData, index) => (
          <GalleryItem
            key={index}
            imgData={imgData}
            onClick={this.handleItemClick(index)}
            width={imagePercentWidth}
          />
        ))}
      </div>
    );

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
        <div className={styles.galleryWrapper} style={{ height: wrapperHeight }}>
          {store.ui.isMobile ? (
            galleryNode
          ) : (
            <Scrollbar
              ref={instance => (this.instanceScroll = instance)}
              minimalThumbSize={14}
              maximalThumbSize={14}
            >
              {galleryNode}
            </Scrollbar>
          )}
        </div>
        {!store.ui.isMobile && <Footer className={styles.footer} />}
        {!store.ui.isMobile && (
          <div className={styles.controls}>
            <Icon glyph={Icon.glyphs.arrowLeftBold} className={styles.control} />
            <Icon glyph={Icon.glyphs.arrowRightBold} className={styles.control} />
          </div>
        )}
      </>
    );
  }
}

export default {
  Component: Gallery,
  stores: { gallery: new StoreGallery() },
};
