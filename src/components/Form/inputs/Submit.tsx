import cn from 'classnames';
import _ from 'lodash';
import React from 'react';

import { connectComponent } from 'utils';
import { MessageObjectType } from 'common';
import { ConnectedProps } from 'commonUnsafe';

import styles from '../Form.scss';

export interface SubmitProps {
  label: MessageObjectType;
  loadingByPath?: string;

  tabIndex?: number;
  disabled?: boolean;
  className?: string;
}

@connectComponent
export class Submit extends React.Component<ConnectedProps & SubmitProps> {
  get params() {
    const { store, label, tabIndex, disabled, className, loadingByPath } = this.props;

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
