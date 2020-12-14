import cn from 'classnames';

import { system } from 'const';
import { Icon } from 'components/Icon';
import { ModalsCollection } from 'components/ModalsCollection';
import { ConnectedComponent } from 'components/ConnectedComponent';
import { TypeModal } from 'models';

import styles from './Modals.scss';

const transitionDuration = `${system.MODALS_LEAVING_TIMEOUT}ms`;

interface ModalProps {
  modal: TypeModal;
  modalIndex: number;
}

@ConnectedComponent.observer
export class Modal extends ConnectedComponent<ModalProps> {
  handleModalRemove = modal => () => {
    const { actions } = this.context;

    return actions.general.modalRemove(modal);
  };

  render() {
    const { store } = this.context;
    const { modal, modalIndex } = this.props;

    const { isLeaving, data = {} } = modal;
    const { title, ContentComponent } = ModalsCollection[modal.name];

    const modalStyle = {
      zIndex: system.MODALS_BASE_Z_INDEX + modalIndex,
      transitionDuration,
    };

    return (
      <div className={cn(styles.modal, isLeaving && styles.isLeaving)} style={modalStyle}>
        <Icon
          glyph={Icon.glyphs.close}
          className={styles.close}
          onClick={this.handleModalRemove(modal)}
        />
        {Boolean(title) && (
          <div className={cn(styles.title, store.ui.currentTheme === 'dark' && styles.linkStyle)}>
            {store.getLn(title)}
          </div>
        )}
        <ContentComponent data={data as any} modalRemove={this.handleModalRemove(modal)} />
      </div>
    );
  }
}

@ConnectedComponent.observer
export class Modals extends ConnectedComponent {
  render() {
    const { store } = this.context;

    if (!store.ui.modalIsOpen) return null;

    const backdropStyle = {
      zIndex: system.MODALS_BASE_Z_INDEX,
      transitionDuration,
      animationDuration: transitionDuration,
    };

    return (
      <div
        className={cn(styles.backdrop, store.ui.lastModalIsLeaving && styles.isLeaving)}
        style={backdropStyle}
      >
        <div className={styles.backdropInner}>
          {store.ui.modals.map((modal, modalIndex) => (
            <Modal key={modal.id} modal={modal} modalIndex={modalIndex} />
          ))}
        </div>
      </div>
    );
  }
}
