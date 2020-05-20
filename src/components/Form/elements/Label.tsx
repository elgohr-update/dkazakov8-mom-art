import _ from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';

import { MessageObjectType } from 'common';
import { StoreContext } from 'stores/StoreRoot';

interface LabelProps {
  label: MessageObjectType | string;
  htmlFor: string;

  onClick?: (event?: React.MouseEvent) => void;
  className?: string;
}

@observer
export class Label extends React.Component<LabelProps> {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  render() {
    const { store } = this.context;
    const { label, onClick, htmlFor, className } = this.props;

    if (!label) return null;

    return (
      <label htmlFor={htmlFor} onClick={onClick} className={className}>
        {_.isPlainObject(label) ? store.getLn(label as MessageObjectType) : label}
      </label>
    );
  }
}
