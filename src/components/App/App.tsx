import React from 'react';

import { TypeGalleryItem } from 'models';
import { Router } from 'components/Router';
import { Modals } from 'components/Modals';
import { Lightbox } from 'components/Lightbox';
import { Notifications } from 'components/Notifications';

export class App extends React.Component {
  render() {
    return (
      <>
        <Notifications />
        <Router />
        <Modals />
        <Lightbox srcGetter={(elem: TypeGalleryItem): string => elem.sources.big.src} />
      </>
    );
  }
}
