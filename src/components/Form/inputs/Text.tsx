import _ from 'lodash';
import React from 'react';
import cn from 'classnames';
import { runInAction } from 'mobx';

import { system } from 'const';
import { generateInputId, connectComponent } from 'utils';
import { Label } from 'components/Form/elements/Label';
import { Errors } from 'components/Form/elements/Errors';
import { FieldValidatorType, MessageObjectType } from 'common';
import { ConnectedProps } from 'commonUnsafe';

import styles from '../Form.scss';

export interface TextProps {
  label: MessageObjectType | string;
  storePath: string;

  type?: string;
  tabIndex?: number;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  autoFocus?: boolean;
  isTextarea?: boolean;
  defaultValue?: string;
  validators?: FieldValidatorType[];
}

@connectComponent
export class Text extends React.Component<ConnectedProps & TextProps> {
  get params() {
    const {
      store,
      type = 'text',
      label,
      tabIndex,
      disabled,
      autoFocus,
      className,
      maxLength,
      storePath,
      isTextarea,
    } = this.props;

    return {
      store,
      label,
      tabIndex,
      disabled,
      autoFocus,
      className,
      storePath,
      isTextarea,
      type: isTextarea ? null : type,
      maxLength: maxLength || isTextarea ? system.TEXTAREA_MAX_LENGTH : system.INPUT_MAX_LENGTH,

      id: _.get(store, `${storePath}.id`) || generateInputId(storePath),
      value: _.get(store, `${storePath}.value`) || '',
      errors: _.get(store, `${storePath}.errors`) || [],
      isFocused: _.get(store, `${storePath}.isFocused`) || false,
      isValidFn: _.get(store, `${storePath}.isValidFn`) || _.stubTrue,
      validators: _.get(store, `${storePath}.validators`) || [],
      setValue: this.setValue,
      setErrors: this.setErrors,
      setInputId: this.setInputId,
      setIsFocused: this.setIsFocused,
      setIsValidFn: this.setIsValidFn,
      setValidators: this.setValidators,
    };
  }

  get wrapperClassName() {
    const { params } = this;

    return cn({
      [styles.inputWrapper]: true,
      [styles.focused]: params.isFocused,
      [styles.hasValue]: params.value !== '',
      [styles.hasErrors]: params.errors.length > 0,
      [params.className]: Boolean(params.className),
    });
  }

  handleChange = ({ target: { value } }) => {
    const { params } = this;

    runInAction(() => {
      params.setValue(value);
      params.setIsValidFn();
    });
  };

  handleBlur = () => {
    runInAction(() => {
      const { params } = this;

      params.setIsFocused(false);
      params.isValidFn();
    });
  };

  handleFocus = () => {
    runInAction(() => {
      const { params } = this;

      params.setIsFocused(true);
      params.setErrors([]);
    });
  };

  setValue = value => {
    const { params } = this;

    return _.set(params.store, `${params.storePath}.value`, value);
  };

  setErrors = errors => {
    const { params } = this;

    return _.set(params.store, `${params.storePath}.errors`, errors);
  };

  setInputId = id => {
    const { params } = this;

    return _.set(params.store, `${params.storePath}.id`, id);
  };

  setIsFocused = isFocused => {
    const { params } = this;

    return _.set(params.store, `${params.storePath}.isFocused`, isFocused);
  };

  setIsValidFn = () => {
    const { params } = this;

    function isValidFn() {
      const errorsArray = params.validators.filter(({ notValidCheck }) =>
        notValidCheck({ value: params.value, store: params.store })
      );

      params.setErrors(errorsArray);

      return errorsArray.length === 0;
    }

    return _.set(
      params.store,
      `${params.storePath}.isValidFn`,
      params.disabled ? _.stubTrue : isValidFn
    );
  };

  setValidators = validators => {
    const { params } = this;

    return _.set(params.store, `${params.storePath}.validators`, validators);
  };

  UNSAFE_componentWillMount() {
    runInAction(() => {
      const { params } = this;
      const defaultValue =
        this.props.defaultValue != null ? String(this.props.defaultValue) : params.value;

      if (!_.get(params.store, params.storePath)) {
        _.set(params.store, params.storePath, {});
      }

      params.setValue(defaultValue);
      params.setErrors(params.errors);
      params.setInputId(params.id);
      params.setIsFocused(params.isFocused);
      params.setValidators(this.props.validators);
      params.setIsValidFn();
    });
  }

  render() {
    const { params } = this;

    const Component = params.isTextarea ? 'textarea' : 'input';

    return (
      <div className={this.wrapperClassName}>
        <Label label={params.label} htmlFor={params.id} />
        <Component
          id={params.id}
          name={params.storePath}
          type={params.type}
          value={params.value}
          disabled={params.disabled}
          tabIndex={params.tabIndex}
          autoFocus={params.autoFocus}
          maxLength={params.maxLength}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
        />
        <Errors errors={params.errors} />
      </div>
    );
  }
}
