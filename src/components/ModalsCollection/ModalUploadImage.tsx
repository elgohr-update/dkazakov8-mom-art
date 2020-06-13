import cn from 'classnames';
import React from 'react';

import { Form } from 'components/Form';
import { ConnectedComponent } from 'components/ConnectedComponent';
import { TypeFormSubmit } from 'models';
import { notificationTypes } from 'const';
import { messages } from 'components/ModalsCollection/messages';

import styles from './ModalsCollection.scss';

type TypeFormStore = typeof ConnectedComponent['context']['store']['gallery']['uploadItemForm'];
type TypeFormEditStore = typeof ConnectedComponent['context']['store']['gallery']['editItemForm'];

interface ModalUploadImageProps {
  data?: {
    id: string;
    index: number;
    totalItems: number;
    title: {
      ru: string;
      en: string;
    };
  };
  modalRemove: () => void;
}

@ConnectedComponent.observer
export class ModalUploadImage extends ConnectedComponent<ModalUploadImageProps> {
  handleFormSubmit: TypeFormSubmit<TypeFormStore> = formData => {
    const { store, actions } = this.context;
    const { modalRemove } = this.props;

    if (!formData.file.size) {
      return actions.general.raiseNotification({
        type: notificationTypes.ERROR,
        message: store.getLn(messages.imageNotAttached),
        delay: 3000,
      });
    }

    const formDataExtended = new FormData();
    Object.entries(formData).forEach(([name, value]) => formDataExtended.set(name, value));

    return actions.general
      .uploadImage({ formData: formDataExtended, storePath: `gallery.uploadItemForm` })
      .then(() =>
        store.gallery.uploadItemForm.SYSTEM.clear({
          formConfigInStore: store.gallery.uploadItemForm,
        })
      )
      .then(modalRemove);
  };

  handleFormSubmitEdit: TypeFormSubmit<TypeFormEditStore> = formData => {
    const { store, actions } = this.context;
    const { data, modalRemove } = this.props;

    const formDataExtended = {
      id: data.id,
      order: Number(formData.order),
      title_ru: formData.title_ru,
      title_en: formData.title_en,
    };

    return actions.general
      .updateGalleryItem({ formData: formDataExtended, storePath: `gallery.editItemForm` })
      .then(() =>
        store.gallery.editItemForm.SYSTEM.clear({ formConfigInStore: store.gallery.editItemForm })
      )
      .then(modalRemove);
  };

  handleRemove = () => {
    const { store, actions } = this.context;
    const { data, modalRemove } = this.props;

    // eslint-disable-next-line no-alert
    const isConfirmed = confirm(store.getLn(messages.uploadImage_removeConfirm));

    return isConfirmed
      ? actions.general.deleteImage({ id: data.id }).then(modalRemove)
      : Promise.resolve();
  };

  render() {
    const { store, actions } = this.context;
    const { data } = this.props;

    const isEditMode = data.id != null;

    if (isEditMode) {
      return (
        <Form<TypeFormEditStore>
          onSubmit={this.handleFormSubmitEdit}
          className={styles.modalUploadImage}
          buttonsLineClassName={styles.buttonsLine}
          formConfig={store.gallery.editItemForm}
          beforeSubmitElements={[
            <div
              key="removeButton"
              className={cn(
                styles.removeButton,
                actions.general.deleteImage.data.isExecuting && styles.loading
              )}
              onClick={this.handleRemove}
            >
              {store.getLn(messages.uploadImage_removeButton)}
            </div>,
          ]}
          initialData={{
            order: {
              labelData: { totalItems: data.totalItems - 1 },
            },
            title_ru: {
              value: data.title.ru,
            },
            title_en: {
              value: data.title.en,
            },
          }}
        />
      );
    }

    return (
      <Form<TypeFormStore>
        onSubmit={this.handleFormSubmit}
        className={styles.modalUploadImage}
        buttonsLineClassName={styles.buttonsLine}
        formConfig={store.gallery.uploadItemForm}
      />
    );
  }
}
