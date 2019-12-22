import _ from 'lodash';
import React from 'react';

import { connectComponent, scrollToFirstElement } from 'utils';
import { ConnectedProps } from 'commonUnsafe';

import { Text } from './inputs/Text';
import { Submit } from './inputs/Submit';
import { Textarea } from './inputs/Textarea';

interface FormProps {
  storePath: string;
  className?: string;
  onSubmit?: (formData: object, event: Event) => void;
}

function getNotValidFieldsIds({ formConfig }) {
  return _.values(formConfig)
    .filter(fieldData => !fieldData.isValidFn())
    .map(fieldData => fieldData.id);
}

const inputsCollection = {
  Text,
  Submit,
  Textarea,
};

@connectComponent
export class Form extends React.Component<ConnectedProps & FormProps> {
  static Input = inputsCollection;
  static getNotValidFieldsIds = getNotValidFieldsIds;

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

  handleFormSubmit = event => {
    event.preventDefault();

    const { store, storePath, onSubmit } = this.props;

    const formConfig = _.get(store, storePath);
    const notValidFieldsIds = getNotValidFieldsIds({ formConfig });

    if (notValidFieldsIds.length > 0) {
      return scrollToFirstElement(notValidFieldsIds);
    }

    if (onSubmit) {
      const formData = _.mapValues(formConfig, fieldData => fieldData.value);

      return onSubmit(formData, event);
    }
  };

  render() {
    const { children, className } = this.props;

    return (
      <form
        className={className}
        onSubmit={this.handleFormSubmit}
        ref={node => (this.formElement = node)}
      >
        {children}
      </form>
    );
  }
}
