import cn from 'classnames';
import _ from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';

import { MessageObjectType } from 'common';
import { StoreContext } from 'stores/StoreRoot';

import styles from '../Form.scss';

export interface SubmitProps {
  label: MessageObjectType;
  loadingByPath?: string;

  tabIndex?: number;
  disabled?: boolean;
  className?: string;
}

@observer
export class Submit extends React.Component<SubmitProps> {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  get params() {
    const { store } = this.context;
    const { label, tabIndex, disabled, className, loadingByPath } = this.props;

    return {
      label,
      store,
      tabIndex,
      disabled,
      className,
      isLoading: _.get(store, loadingByPath) || false,
    };
  }

  get wrapperClassName() {
    const { params } = this;

    return cn({
      [styles.submitWrapper]: true,
      [styles.loading]: params.isLoading,
      [params.className]: Boolean(params.className),
    });
  }

  handleClick = event => {
    const { params } = this;

    if (params.disabled || params.isLoading) {
      event.preventDefault();
    }
  };

  render() {
    const { params, wrapperClassName } = this;

    return (
      <div className={wrapperClassName}>
        <input
          type="submit"
          value={params.store.getLn(params.label)}
          onClick={this.handleClick}
          disabled={params.disabled}
          tabIndex={params.tabIndex}
        />
      </div>
    );
  }
}
