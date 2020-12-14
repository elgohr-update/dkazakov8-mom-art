import { MouseEvent } from 'react';

import { TypeGalleryItem } from 'models';
import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from './Gallery.scss';

interface GalleryItemProps {
  onClick: (event?: MouseEvent) => void;
  imgData: TypeGalleryItem;
  width: string;
}

@ConnectedComponent.observer
export class GalleryItem extends ConnectedComponent<GalleryItemProps> {
  render() {
    const {
      store: {
        ui: { currentLanguage },
      },
    } = this.context;
    const { imgData, onClick, width } = this.props;
    const title = imgData.title[currentLanguage];

    return (
      <a
        className={styles.item}
        href={imgData.sources.big.src}
        title={title}
        onClick={onClick}
        style={{ width }}
      >
        <div
          className={styles.itemInner}
          style={{ backgroundImage: `url('${imgData.sources.small.src}')` }}
        >
          <span className={styles.caption}>
            <span className={styles.captionTitle}>{title}</span>
          </span>
        </div>
      </a>
    );
  }
}
