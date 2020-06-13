import _ from 'lodash';
import { runInAction } from 'mobx';

import { system } from 'const';
import { TypeAction } from 'models';

type Params = {
  direction?: string;
  index?: number;
  elements?: any[];
  bigLoadedIndex?: number;
};

export const changeLightbox: TypeAction<Params> = (
  { store },
  { direction, index, elements, bigLoadedIndex }
) => {
  const {
    ui: { lightbox },
  } = store;

  if (lightbox.isRemoving) {
    /**
     * Dear user, please stop clicking around after closing lightbox
     * for at least several milliseconds!
     *
     */

    return Promise.resolve();
  }

  if (elements) {
    lightbox.elementsArray = elements;
  }

  if (_.isNumber(bigLoadedIndex)) {
    lightbox.elementsArray[bigLoadedIndex].bigIsLoaded = true;
  }

  if (direction === 'forward') {
    const nextIndex = lightbox.currentIndex + 1;

    if (lightbox.elementsArray.length > nextIndex) {
      lightbox.currentIndex = nextIndex;
    } else {
      lightbox.currentIndex = 0;
    }
  } else if (direction === 'backward') {
    const nextIndex = lightbox.currentIndex - 1;

    if (nextIndex >= 0) {
      lightbox.currentIndex = nextIndex;
    } else {
      lightbox.currentIndex = lightbox.elementsArray.length - 1;
    }
  } else if (_.isNumber(index)) {
    if (index === -1) {
      lightbox.isRemoving = true;

      /**
       * Don't care about clearing timeout because store is permanent,
       * but care about running several modifications in one transaction
       *
       */

      setTimeout(
        () =>
          runInAction(() => {
            lightbox.isRemoving = false;
            lightbox.currentIndex = index;
          }),
        system.LIGHTBOX_LEAVING_TIMEOUT
      );
    } else {
      lightbox.currentIndex = index;
    }
  }

  return Promise.resolve();
};
