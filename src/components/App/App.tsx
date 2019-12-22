import React from 'react';

import { Router } from 'components/Router';
import { Modals } from 'components/Modals';
import { Lightbox } from 'components/Lightbox';
import { Notifications } from 'components/Notifications';
import { GalleryItemType } from 'stores/StoreGallery';

export class App extends React.Component {
  render() {
    return (
      <>
        <Notifications />
        <Router />
        <Modals />
        <Lightbox srcGetter={(elem: GalleryItemType): string => elem.sources.big.src} />
      </>
    );
  }
}
