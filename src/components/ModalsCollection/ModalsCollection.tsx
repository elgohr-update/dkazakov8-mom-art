import _ from 'lodash';
import cn from 'classnames';
import React from 'react';
import { observer } from 'mobx-react';

import { fieldValidators } from 'utils';
import { notificationTypes } from 'const';
import { FormFileType } from 'common';
import { Form } from 'components/Form';
import { StoreContext } from 'stores/StoreRoot';

import { messages } from './messages';
import styles from './ModalsCollection.scss';

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
  removeModal: () => void;
}

@observer
class ModalUploadImage extends React.Component<ModalUploadImageProps> {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  handleFormSubmit = (formData, event) => {
    const { store } = this.context;
    const { data, removeModal } = this.props;
    const isEditMode = Boolean(data.id);

    if (isEditMode) {
      const storePath = `gallery.editItemForm`;
      const formDataExtended = {
        id: data.id,
        order: Number(formData.order),
        title_ru: formData.title_ru,
        title_en: formData.title_en,
      };

      return store.actions.common
        .updateGalleryItem({ formData: formDataExtended, storePath })
        .then(removeModal)
        .then(() => _.set(store, storePath, {}));
    }

    const storePath = `gallery.uploadItemForm`;
    const formDataExtended = new FormData(event.target);

    formDataExtended.set('title_ru', formData.title_ru);
    formDataExtended.set('title_en', formData.title_en);

    const [file] = (formDataExtended.getAll('file') as unknown) as FormFileType[];

    if (!file.size) {
      return store.actions.common.raiseNotification({
        type: notificationTypes.ERROR,
        message: store.getLn(messages.imageNotAttached),
        delay: 3000,
      });
    }

    return store.actions.common
      .uploadImage({ formData: formDataExtended, storePath })
      .then(removeModal)
      .then(() => _.set(store, storePath, {}));
  };

  handleRemove = () => {
    const { store } = this.context;
    const { data, removeModal } = this.props;

    // eslint-disable-next-line no-alert
    const isConfirmed = confirm(store.getLn(messages.uploadImage_removeConfirm));

    return isConfirmed
      ? store.actions.common.deleteImage({ id: data.id }).then(removeModal)
      : Promise.resolve();
  };

  render() {
    const { store } = this.context;
    const { data } = this.props;
    const isEditMode = Boolean(data.id);

    if (isEditMode) {
      const storePath = `gallery.editItemForm`;

      return (
        <Form
          storePath={storePath}
          onSubmit={this.handleFormSubmit}
          className={styles.modalUploadImage}
        >
          <Form.Input.Text
            validators={[fieldValidators.emptyString]}
            storePath={`${storePath}.title_ru`}
            label={store.getLn(messages.uploadImage_imageTitle, { lang: 'русский' })}
            defaultValue={data.title.ru}
          />
          <Form.Input.Text
            validators={[fieldValidators.emptyString]}
            storePath={`${storePath}.title_en`}
            label={store.getLn(messages.uploadImage_imageTitle, { lang: 'english' })}
            defaultValue={data.title.en}
          />
          <Form.Input.Text
            validators={[fieldValidators.emptyString]}
            storePath={`${storePath}.order`}
            label={store.getLn(messages.uploadImage_order, { totalItems: data.totalItems - 1 })}
            defaultValue={String(data.index)}
          />
          <div className={styles.buttonsLine}>
            <div
              className={cn(
                styles.removeButton,
                store.executions.common.deleteImage && styles.loading
              )}
              onClick={this.handleRemove}
            >
              {store.getLn(messages.uploadImage_removeButton)}
            </div>
            <Form.Input.Submit
              className={styles.saveButton}
              label={messages.uploadImage_saveButton}
              loadingByPath={`executions.common.updateGalleryItem`}
            />
          </div>
        </Form>
      );
    }

    const storePath = `gallery.uploadItemForm`;

    return (
      <Form
        storePath={storePath}
        onSubmit={this.handleFormSubmit}
        className={styles.modalUploadImage}
      >
        <Form.Input.Text
          validators={[fieldValidators.emptyString]}
          storePath={`${storePath}.title_ru`}
          label={store.getLn(messages.uploadImage_imageTitle, { lang: 'русский' })}
        />
        <Form.Input.Text
          validators={[fieldValidators.emptyString]}
          storePath={`${storePath}.title_en`}
          label={store.getLn(messages.uploadImage_imageTitle, { lang: 'english' })}
        />
        <input type="file" name="file" />
        <div className={styles.buttonsLine}>
          <Form.Input.Submit
            className={cn(styles.saveButton, styles.fullWidth)}
            label={messages.uploadImage_saveButton}
            loadingByPath={`executions.common.uploadImage`}
          />
        </div>
      </Form>
    );
  }
}

@observer
class ModalAuth extends React.Component<{ removeModal: () => void }> {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  handleFormSubmit = formData => {
    const { store } = this.context;
    const { removeModal } = this.props;

    const storePath = `user.authForm`;

    return store.actions.common
      .auth(formData)
      .then(removeModal)
      .then(() => _.set(store, storePath, {}));
  };

  render() {
    const { store } = this.context;

    const storePath = `user.authForm`;

    return (
      <Form
        storePath={storePath}
        onSubmit={this.handleFormSubmit}
        className={styles.modalUploadImage}
      >
        <Form.Input.Text
          validators={[fieldValidators.emptyString]}
          storePath={`${storePath}.email`}
          label={store.getLn(messages.auth_email)}
        />
        <Form.Input.Text
          validators={[fieldValidators.emptyString]}
          storePath={`${storePath}.password`}
          label={store.getLn(messages.auth_password)}
        />
        <div className={styles.buttonsLine}>
          <Form.Input.Submit
            className={cn(styles.saveButton, styles.fullWidth)}
            label={messages.auth_submitButton}
            loadingByPath={`executions.common.auth`}
          />
        </div>
      </Form>
    );
  }
}

export const ModalsCollection = {
  ModalUploadImage: {
    name: 'ModalUploadImage',
    title: messages.uploadImage_title,
    ContentComponent: ModalUploadImage,
  },
  ModalAuth: {
    name: 'ModalAuth',
    title: messages.auth_title,
    ContentComponent: ModalAuth,
  },
};
