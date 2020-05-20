import cn from 'classnames';
import React from 'react';
import { observer } from 'mobx-react';

import { Icon } from 'components/Icon';
import { Spinner } from 'components/Spinner';
import { StoreContext } from 'stores/StoreRoot';

import styles from './Lightbox.scss';

interface LightboxProps {
  srcGetter: (obj: Record<string, any>) => string;
}

@observer
export class Lightbox extends React.Component<LightboxProps> {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    const { store } = this.context;

    window.removeEventListener('keydown', this.onKeyDown);

    store.actions.common.changeLightbox({ elements: [] });
  }

  onKeyDown = event => {
    const { store } = this.context;

    if (store.ui.lightbox.currentIndex === -1) {
      return false;
    }

    // Esc
    if (event.keyCode === 27) {
      event.preventDefault();

      store.actions.common.changeLightbox({ index: -1 });
    }

    // ArrowLeft
    else if (event.keyCode === 37) {
      event.preventDefault();

      store.actions.common.changeLightbox({ direction: 'backward' });
    }

    // ArrowRight
    else if (event.keyCode === 39) {
      event.preventDefault();

      store.actions.common.changeLightbox({ direction: 'forward' });
    }
  };

  render() {
    const { store } = this.context;
    const { srcGetter } = this.props;
    const { currentIndex, elementsArray, isRemoving } = store.ui.lightbox;

    const currentItem = elementsArray[currentIndex] || {};
    const moreThanOneElement = elementsArray.length > 1;

    return (
      <div className={styles.lightbox}>
        {currentIndex !== -1 && (
          <div
            className={cn(
              styles.backdrop,
              isRemoving && styles.leaving,
              currentItem.bigIsLoaded && styles.loaded
            )}
          >
            {moreThanOneElement && (
              <Icon
                className={styles.arrowLeft}
                glyph={Icon.glyphs.arrowLeft}
                onClick={() => store.actions.common.changeLightbox({ direction: 'backward' })}
              />
            )}
            {moreThanOneElement && (
              <Icon
                className={styles.arrowRight}
                glyph={Icon.glyphs.arrowRight}
                onClick={() => store.actions.common.changeLightbox({ direction: 'forward' })}
              />
            )}
            <Icon
              className={styles.close}
              glyph={Icon.glyphs.close}
              onClick={() => store.actions.common.changeLightbox({ index: -1 })}
            />
            <Spinner className={styles.spinner} size={100} />
            <img
              src={srcGetter(currentItem)}
              title={currentItem.title[store.ui.currentLanguage]}
              onLoad={() => {
                store.actions.common.changeLightbox({ bigLoadedIndex: currentIndex });
              }}
            />
          </div>
        )}
      </div>
    );
  }
}
