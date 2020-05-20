import React from 'react';
import { observable } from 'mobx';

import { generateArray } from 'utils';
import { Header } from 'components/Header';
import { ModalsCollection } from 'components/ModalsCollection';
import { TypeGalleryItem } from 'models';
import { StoreContext } from 'stores/StoreRoot';

import { GalleryItem } from './GalleryItem';
import styles from './Gallery.scss';
import { messages } from './messages';

const ITEMS_SPACER = 10;
const GALLERY_PADDING = 20;
const GALLERY_MAX_WIDTH = 900;

export class Gallery extends React.Component {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  UNSAFE_componentWillMount() {
    const { store } = this.context;

    store.router.metaData = {
      title: store.getLn(messages.metaTitle),
      description: store.getLn(messages.metaDescription),
    };
  }

  innerState = observable({ mounted: false });

  componentDidMount() {
    this.innerState.mounted = true;
  }

  getItemStyle = (index: number) => {
    /**
     * Server does not know screen width, so it should not try to guess
     *
     */
    if (!IS_CLIENT || !this.innerState.mounted) {
      return {};
    }

    const { itemsInRow, itemWidth } = this;

    const style: React.CSSProperties = {};
    const itemColumn = index % itemsInRow;
    const aboveImagesHeight = this.getAboveImagesHeight({ index });

    style.width = `${itemWidth}px`;
    style.transform = `translate(${itemColumn * itemWidth}px, ${aboveImagesHeight}px)`;
    style.paddingLeft = `${ITEMS_SPACER / 2}px`;
    style.paddingRight = style['padding-left'];

    return style;
  };

  getItemHeight = (itemData: TypeGalleryItem) => {
    const { itemWidth } = this;
    const { width, height } = itemData.sources.small;

    return Math.floor(((itemWidth - ITEMS_SPACER) / width) * height);
  };

  getAboveImagesHeight = ({ index, height = 0 }: { index: number; height?: number }): number => {
    const { itemsInRow } = this;
    const {
      store: {
        gallery: { items },
      },
    } = this.context;

    const aboveImgIndex = index - itemsInRow;
    const aboveImgData = items[aboveImgIndex];

    if (!aboveImgData) {
      return height;
    }

    const aboveImgHeight = this.getItemHeight(aboveImgData);

    return this.getAboveImagesHeight({
      index: aboveImgIndex,
      height: height + aboveImgHeight + ITEMS_SPACER,
    });
  };

  get itemWidth() {
    return this.galleryWidth / this.itemsInRow;
  }

  get itemsInRow() {
    return this.galleryWidth < 400 ? 2 : 3;
  }

  get columnsHeight() {
    const { itemsInRow } = this;
    const {
      store: {
        gallery: { items },
      },
    } = this.context;

    return generateArray(itemsInRow).map(index => {
      const itemIndex = items.length - 1 - index;
      const item = items[itemIndex];

      if (!item) {
        return 0;
      }

      return this.getAboveImagesHeight({ index: itemIndex }) + this.getItemHeight(item);
    });
  }

  get galleryWidth() {
    /**
     * Server does not know screen width, so it should not try to guess
     *
     */
    if (!IS_CLIENT || !this.innerState.mounted) {
      return 0;
    }

    const {
      store: {
        ui: { screen },
      },
    } = this.context;

    let galleryWidth = screen.width - GALLERY_PADDING * 2;
    galleryWidth = Math.min(GALLERY_MAX_WIDTH, galleryWidth);

    return galleryWidth;
  }

  get galleryHeight() {
    /**
     * Server does not know screen width, so it should not try to guess
     *
     */
    if (!IS_CLIENT || !this.innerState.mounted) {
      return 0;
    }

    const { columnsHeight } = this;

    return Math.max(...columnsHeight);
  }

  handleItemClick = (index: number) => (event: React.MouseEvent) => {
    const {
      store,
      store: {
        gallery: { items },
        user: { isLoggedIn },
      },
    } = this.context;

    event.preventDefault();

    if (isLoggedIn) {
      return store.actions.common.raiseModal({
        name: ModalsCollection.ModalUploadImage.name,
        data: { ...items[index], index, totalItems: items.length },
      });
    }

    return store.actions.common.changeLightbox({ index, elements: items });
  };

  render() {
    const {
      store,
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
              onClick={() =>
                store.actions.common.raiseModal({ name: ModalsCollection.ModalUploadImage.name })
              }
            >
              {store.getLn(messages.uploadButton)}
            </div>
          </div>
        )}
        {items.length > 0 && (
          <div
            className={styles.gallery}
            style={{ width: `${this.galleryWidth}px`, height: `${this.galleryHeight}px` }}
          >
            {items.map((imgData, index) => (
              <GalleryItem
                key={index}
                style={this.getItemStyle(index)}
                imgData={imgData}
                onClick={this.handleItemClick(index)}
              />
            ))}
          </div>
        )}
      </>
    );
  }
}
