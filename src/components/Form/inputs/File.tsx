import _ from 'lodash';
import cn from 'classnames';
import React from 'react';
import { autorun, IReactionDisposer } from 'mobx';

import { MessageObjectType } from 'common';
import { ConnectedComponent } from 'components/ConnectedComponent';
import { TypeFormConfig, TypeInputFileConfig } from 'models';
import styles from 'components/Form/Form.scss';
import { Errors } from 'components/Form/elements/Errors';
import { generateInputId, getObservablePath } from 'utils';

export interface FileProps<T> {
  name: string;
  label: MessageObjectType;
  formConfig: T;
  inputConfig: TypeInputFileConfig;

  tabIndex?: number;
  className?: string;
}

@ConnectedComponent.observer
export class FileInput<T extends TypeFormConfig<T>> extends ConnectedComponent<FileProps<T>> {
  disabledChangeDisposer: IReactionDisposer;

  get wrapperClassName() {
    const { className } = this.props;

    return cn({
      [styles.inputWrapper]: true,
      [className]: Boolean(className),
    });
  }

  isValidFn = () => {
    const {
      inputConfig: { value, validators, disabled },
    } = this.props;

    if (disabled) return true;

    const errors = _.values(validators)
      .filter(({ notValidCheck }) => notValidCheck({ value }))
      .map(({ message }) => message);

    this.updateInputConfig({ errors });

    return errors.length === 0;
  };

  updateInputConfig = (params: Partial<TypeInputFileConfig>) => {
    const { inputConfig } = this.props;

    Object.assign(inputConfig, params);
  };

  handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.updateInputConfig({ value: target.files[0] });
  };

  clearErrorsOnDisabledChange = () => {
    const { inputConfig } = this.props;

    this.disabledChangeDisposer = autorun(() => {
      if (inputConfig.disabled === true && inputConfig.errors.length)
        this.updateInputConfig({ errors: [] });
    });
  };

  UNSAFE_componentWillMount() {
    const { inputConfig, name, formConfig } = this.props;

    const initialInputConfig = {
      id: generateInputId(`${getObservablePath(formConfig)}_${name}`),
      errors: [],
      isFocused: false,
      isValidFn: this.isValidFn,
      validators: inputConfig.validators || {},
    };

    this.updateInputConfig(initialInputConfig);
    this.clearErrorsOnDisabledChange();
  }

  render() {
    const { name, tabIndex, inputConfig } = this.props;

    return (
      <div className={this.wrapperClassName}>
        <input type="file" name={name} tabIndex={tabIndex} onChange={this.handleChange} />
        <Errors errors={inputConfig.errors || []} />
      </div>
    );
  }
}
