import _ from 'lodash';
import React from 'react';

import { TypeFormConfig, TypeFormSubmit } from 'models';
import { scrollToFirstElement, getNotValidFieldsIds } from 'utils';
import { ConnectedComponent } from 'components/ConnectedComponent';

import { Text } from './inputs/Text';
import { Submit } from './inputs/Submit';
import { FileInput } from './inputs/File';

interface FormProps<T extends TypeFormConfig<T>> {
  onSubmit: TypeFormSubmit<T>;
  formConfig: T;
  className?: string;
  initialData?: { [Key in keyof T]?: Partial<T[Key]> };
  buttonsLineClassName?: string;
  beforeSubmitElements?: Array<React.ReactNode>;
}

@ConnectedComponent.observer
export class Form<T extends TypeFormConfig<T>> extends ConnectedComponent<FormProps<T>> {
  static Input = {
    File: FileInput,
    Text,
    Submit,
  };
  formElement: HTMLElement = null;

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = event => {
    if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
          event.preventDefault();
          this.formElement.dispatchEvent(new Event('submit'));
          break;
        default:
          break;
      }
    }
  };

  handleFormSubmit = (event: React.FormEvent) => {
    const { store } = this.context;
    const { formConfig, onSubmit } = this.props;

    event.preventDefault();

    if (formConfig.SYSTEM.isSubmitting) return Promise.resolve();

    formConfig.SYSTEM.isSubmitting = true;

    const formConfigWithoutSystem = _.omit(formConfig, ['SYSTEM', 'submit']);
    const formData = _.mapValues(formConfigWithoutSystem, ({ value }) => value);
    const notValidFieldsIds = getNotValidFieldsIds({ formConfig: formConfigWithoutSystem });

    if (notValidFieldsIds.length) {
      formConfig.SYSTEM.isSubmitting = false;

      return store.ui.modalIsOpen
        ? Promise.resolve()
        : Promise.resolve(scrollToFirstElement(notValidFieldsIds));
    }

    return onSubmit(formData, event)
      .then(() => {
        formConfig.SYSTEM.isSubmitting = false;
      })
      .catch(() => {
        formConfig.SYSTEM.isSubmitting = false;
      });
  };

  render() {
    const {
      className,
      formConfig,
      initialData,
      buttonsLineClassName,
      beforeSubmitElements,
    } = this.props;

    const formConfigWithoutSystem = _.omit(formConfig, ['SYSTEM', 'submit']);
    const componentsMapper = {
      text: Form.Input.Text,
      file: Form.Input.File,
    };

    return (
      <form
        className={className}
        onSubmit={this.handleFormSubmit}
        ref={node => (this.formElement = node)}
      >
        {Object.entries(formConfigWithoutSystem).map(
          ([name, inputConfig]: [Extract<keyof T, string>, T[keyof T]]) => {
            const Component = componentsMapper[inputConfig.type];

            return (
              <Component<T>
                key={name}
                name={name}
                formConfig={formConfig}
                inputConfig={inputConfig}
                initialData={initialData != null ? initialData[name] : undefined}
              />
            );
          }
        )}
        <div className={buttonsLineClassName}>
          {beforeSubmitElements}
          {formConfig.submit && (
            <Form.Input.Submit<T> formConfig={formConfig} inputConfig={formConfig.submit} />
          )}
        </div>
      </form>
    );
  }
}
