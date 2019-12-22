import React from 'react';

import { connectComponent } from 'utils';
import { ConnectedProps } from 'commonUnsafe';
import { GalleryItemType } from 'stores/StoreGallery';

import styles from './Gallery.scss';

interface GalleryItemProps {
  style: object;
  onClick: (event?: Event) => void;
  imgData: GalleryItemType;
}

@connectComponent
export class GalleryItem extends React.Component<ConnectedProps & GalleryItemProps> {
  render() {
    const {
      store: {
        ui: { currentLanguage },
      },
    } = this.props;
    const { imgData, style, onClick } = this.props;
    const title = imgData.title[currentLanguage];

    return (
      <a
        className={styles.item}
        href={imgData.sources.big.src}
        style={style}
        title={title}
        onClick={onClick}
      >
        <img src={imgData.sources.small.src} alt={title} title={title} />
      </a>
    );
  }
}
