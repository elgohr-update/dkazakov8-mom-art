import cn from 'classnames';

import { ConnectedComponent } from 'components/ConnectedComponent';
import { TypeFormConfig, TypeInputSubmitConfig } from 'models';

import styles from '../Form.scss';

export interface SubmitProps<T> {
  formConfig: T;
  inputConfig: TypeInputSubmitConfig;
}

@ConnectedComponent.observer
export class Submit<T extends TypeFormConfig<T>> extends ConnectedComponent<SubmitProps<T>> {
  get wrapperClassName() {
    const { formConfig, inputConfig } = this.props;

    return cn({
      [styles.submitWrapper]: true,
      [styles.loading]: formConfig.SYSTEM.isSubmitting,
      [inputConfig.className]: Boolean(inputConfig.className),
    });
  }

  render() {
    const { store } = this.context;
    const { inputConfig } = this.props;

    return (
      <div className={this.wrapperClassName}>
        <input
          type="submit"
          value={store.getLn(inputConfig.label, inputConfig.labelData)}
          tabIndex={inputConfig.tabIndex}
          disabled={inputConfig.disabled}
        />
      </div>
    );
  }
}
