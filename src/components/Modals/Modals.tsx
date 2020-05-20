import cn from 'classnames';
import React from 'react';
import { observer } from 'mobx-react';

import { Icon } from 'components/Icon';
import { ModalsCollection } from 'components/ModalsCollection';
import { StoreContext } from 'stores/StoreRoot';

import styles from './Modals.scss';

@observer
export class Modals extends React.Component {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  handleRemoveModal = modal => () => {
    const { store } = this.context;

    return store.actions.common.removeModal(modal);
  };

  render() {
    const { store } = this.context;

    return (
      <div className={styles.modals}>
        {store.ui.modals.map((modal, modalIndex) => {
          const { status, data = {} } = modal;
          const { title, ContentComponent } = ModalsCollection[modal.name];

          const backdropStyle = { zIndex: 12 + modalIndex };
          const backdropClassname = cn({
            [styles.backdrop]: true,
            [styles[status]]: Boolean(styles[status]),
          });
          const removeModal = this.handleRemoveModal(modal);

          return (
            <div key={modal.id} className={backdropClassname} style={backdropStyle}>
              <div className={styles.modal}>
                <Icon glyph={Icon.glyphs.close} className={styles.close} onClick={removeModal} />
                {Boolean(title) && <div className={styles.modalTitle}>{store.getLn(title)}</div>}
                <ContentComponent data={data} removeModal={removeModal} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
