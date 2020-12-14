import _ from 'lodash';
import cn from 'classnames';
import { ChangeEvent } from 'react';
import { autorun, IReactionDisposer, runInAction } from 'mobx';

import { system } from 'const';
import { generateInputId, getObservablePath } from 'utils';
import { TypeInputTextConfig, TypeFormConfig } from 'models';
import { Icon } from 'components/Icon';
import { Label } from 'components/Form/elements/Label';
import { Errors } from 'components/Form/elements/Errors';
import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from '../Form.scss';

export interface TextProps<T extends TypeFormConfig<T>> {
  name: Extract<keyof T, string>;
  formConfig: T;
  initialData?: Partial<TypeInputTextConfig>;
  inputConfig: TypeInputTextConfig;

  // Not used currently
  className?: string;
}

@ConnectedComponent.observer
export class Text<T extends TypeFormConfig<T>> extends ConnectedComponent<TextProps<T>> {
  disabledChangeDisposer: IReactionDisposer;

  get wrapperClassName() {
    const { className, inputConfig } = this.props;

    return cn({
      [styles.inputWrapper]: true,
      [styles.focused]: inputConfig.isFocused,
      [styles.disabled]: inputConfig.disabled,
      [styles.hasValue]: inputConfig.value !== '',
      [styles.hasErrors]: inputConfig.errors.length > 0,
      [styles.hasIcon]: Boolean(inputConfig.icon),
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

  updateInputConfig = (params: Partial<TypeInputTextConfig>) => {
    const { inputConfig } = this.props;

    runInAction(() => Object.assign(inputConfig, params));
  };

  handleBlur = () => {
    this.updateInputConfig({ isFocused: false });
    this.isValidFn();
  };

  handleFocus = () => {
    this.updateInputConfig({ isFocused: true, errors: [] });
  };

  handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.updateInputConfig({ value });
  };

  clearErrorsOnDisabledChange = () => {
    const { inputConfig } = this.props;

    this.disabledChangeDisposer = autorun(() => {
      if (inputConfig.disabled === true && inputConfig.errors.length)
        this.updateInputConfig({ errors: [] });
    });
  };

  UNSAFE_componentWillMount() {
    const { inputConfig, name, formConfig, initialData } = this.props;

    const initialInputConfig = {
      id: generateInputId(`${getObservablePath(formConfig)}_${name}`),
      value: initialData?.value || inputConfig.value,
      errors: [],
      isFocused: false,
      isValidFn: this.isValidFn,
      validators: inputConfig.validators || {},
    };

    this.updateInputConfig(initialInputConfig);
    this.clearErrorsOnDisabledChange();
  }
  componentWillUnmount() {
    this.disabledChangeDisposer();
  }

  render() {
    const { name, inputConfig, initialData } = this.props;
    const isTextarea = inputConfig.type === 'textarea';

    const maxLengthWithDefault = _.isNumber(inputConfig.maxLength)
      ? inputConfig.maxLength
      : isTextarea
      ? system.TEXTAREA_MAX_LENGTH
      : system.INPUT_MAX_LENGTH;

    const Component = isTextarea ? 'textarea' : 'input';

    return (
      <div className={this.wrapperClassName}>
        {Boolean(inputConfig.icon) && <Icon glyph={inputConfig.icon} className={styles.icon} />}
        <Label
          label={inputConfig.label}
          htmlFor={inputConfig.id}
          labelData={initialData?.labelData || inputConfig.labelData}
        />
        <Component
          id={inputConfig.id}
          name={name}
          type={isTextarea ? undefined : inputConfig.type}
          value={inputConfig.value}
          disabled={inputConfig.disabled}
          tabIndex={inputConfig.tabIndex}
          autoFocus={inputConfig.autoFocus}
          maxLength={maxLengthWithDefault}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
        />
        <Errors errors={inputConfig.errors} />
      </div>
    );
  }
}
