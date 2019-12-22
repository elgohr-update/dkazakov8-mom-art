import _ from 'lodash';
import React from 'react';

import { connectComponent } from 'utils';
import { MessageObjectType } from 'common';
import { ConnectedProps } from 'commonUnsafe';

interface LabelProps {
  label: MessageObjectType | string;
  htmlFor: string;

  onClick?: (event?: Event) => void;
  className?: string;
}

@connectComponent
export class Label extends React.Component<ConnectedProps & LabelProps> {
  render() {
    const { store, label, onClick, htmlFor, className } = this.props;

    if (!label) {
      return null;
    }

    return (
      <label htmlFor={htmlFor} onClick={onClick} className={className}>
        {_.isPlainObject(label) ? store.getLn(label as MessageObjectType) : label}
      </label>
    );
  }
}
