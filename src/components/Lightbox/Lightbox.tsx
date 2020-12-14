import cn from 'classnames';

import { Icon } from 'components/Icon';
import { Spinner } from 'components/Spinner';
import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from './Lightbox.scss';

interface LightboxProps {
  srcGetter: (obj: Record<string, any>) => string;
}

@ConnectedComponent.observer
export class Lightbox extends ConnectedComponent<LightboxProps> {
  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    const { actions } = this.context;

    window.removeEventListener('keydown', this.onKeyDown);

    actions.general.changeLightbox({ elements: [] });
  }

  onKeyDown = event => {
    const { store, actions } = this.context;

    if (store.ui.lightbox.currentIndex === -1) {
      return false;
    }

    // Esc
    if (event.keyCode === 27) {
      event.preventDefault();

      actions.general.changeLightbox({ index: -1 });
    }

    // ArrowLeft
    else if (event.keyCode === 37) {
      event.preventDefault();

      actions.general.changeLightbox({ direction: 'backward' });
    }

    // ArrowRight
    else if (event.keyCode === 39) {
      event.preventDefault();

      actions.general.changeLightbox({ direction: 'forward' });
    }
  };

  render() {
    const { store, actions } = this.context;
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
                onClick={() => actions.general.changeLightbox({ direction: 'backward' })}
              />
            )}
            {moreThanOneElement && (
              <Icon
                className={styles.arrowRight}
                glyph={Icon.glyphs.arrowRight}
                onClick={() => actions.general.changeLightbox({ direction: 'forward' })}
              />
            )}
            <Icon
              className={styles.close}
              glyph={Icon.glyphs.close}
              onClick={() => actions.general.changeLightbox({ index: -1 })}
            />
            <Spinner className={styles.spinner} size={100} />
            <img
              src={srcGetter(currentItem)}
              title={currentItem.title[store.ui.currentLanguage]}
              onLoad={() => {
                actions.general.changeLightbox({ bigLoadedIndex: currentIndex });
              }}
            />
          </div>
        )}
      </div>
    );
  }
}
