import _ from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';

import { scrollToFirstElement, getNotValidFieldsIds } from 'utils';
import { StoreContext } from 'stores/StoreRoot';

import { Text } from './inputs/Text';
import { Submit } from './inputs/Submit';
import { Textarea } from './inputs/Textarea';

interface FormProps {
  storePath: string;
  className?: string;
  onSubmit?: (formData: Record<string, any>, event: Event) => void;
}

const inputsCollection = {
  Text,
  Submit,
  Textarea,
};

@observer
export class Form extends React.Component<FormProps> {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

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

    const { store } = this.context;
    const { storePath, onSubmit } = this.props;

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
