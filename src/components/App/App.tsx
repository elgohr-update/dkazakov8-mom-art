import cn from 'classnames';

import { system } from 'const';
import { TypeGalleryItem } from 'models';
import { Router } from 'components/Router';
import { Modals } from 'components/Modals';
import { Lightbox } from 'components/Lightbox';
import { Notifications } from 'components/Notifications';
import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from './App.scss';

@ConnectedComponent.observer
export class App extends ConnectedComponent {
  render() {
    const { store } = this.context;
    const transitionDuration = store.ui.modalIsOpen
      ? `${system.MODALS_LEAVING_TIMEOUT}ms`
      : undefined;

    return (
      <>
        <div
          className={cn(
            styles.app,
            store.ui.modalIsOpen && !store.ui.lastModalIsLeaving && styles.blurred,
            !store.ui.firstRendered && styles.invisible
          )}
          style={{ transitionDuration }}
        >
          <Router />
        </div>
        <Notifications />
        <Modals />
        <Lightbox srcGetter={(elem: TypeGalleryItem) => elem.sources.big.src} />
      </>
    );
  }
}
