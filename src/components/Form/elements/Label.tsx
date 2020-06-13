import _ from 'lodash';
import React from 'react';

import { MessageObjectType } from 'common';
import { ConnectedComponent } from 'components/ConnectedComponent';

interface LabelProps {
  label: MessageObjectType | string;
  htmlFor: string;

  onClick?: (event?: React.MouseEvent) => void;
  className?: string;
  labelData?: Record<string, any>;
}

@ConnectedComponent.observer
export class Label extends ConnectedComponent<LabelProps> {
  render() {
    const { store } = this.context;
    const { label, onClick, htmlFor, className, labelData } = this.props;

    if (!label) return null;

    return (
      <label htmlFor={htmlFor} onClick={onClick} className={className}>
        {_.isPlainObject(label) ? store.getLn(label as MessageObjectType, labelData) : label}
      </label>
    );
  }
}
