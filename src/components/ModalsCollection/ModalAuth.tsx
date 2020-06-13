import React from 'react';

import { Form } from 'components/Form';
import { ConnectedComponent } from 'components/ConnectedComponent';
import { TypeFormSubmit } from 'models';

import styles from './ModalsCollection.scss';

interface ModalModalAuthProps {
  modalRemove: () => void;
}

type TypeFormStore = typeof ConnectedComponent['context']['store']['user']['authFormConfig'];

@ConnectedComponent.observer
export class ModalAuth extends ConnectedComponent<ModalModalAuthProps> {
  handleFormSubmit: TypeFormSubmit<TypeFormStore> = formData => {
    const { store, actions } = this.context;
    const { modalRemove } = this.props;

    return Promise.resolve()
      .then(() => actions.general.auth(formData))
      .then(() =>
        store.user.authFormConfig.SYSTEM.clear({ formConfigInStore: store.user.authFormConfig })
      )
      .then(modalRemove);
  };

  render() {
    const { store } = this.context;

    return (
      <Form<TypeFormStore>
        onSubmit={this.handleFormSubmit}
        className={styles.modalAuth}
        buttonsLineClassName={styles.buttonsLine}
        formConfig={store.user.authFormConfig}
      />
    );
  }
}
