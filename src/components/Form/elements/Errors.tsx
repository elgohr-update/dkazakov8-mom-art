import _ from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';

import { FieldValidatorType } from 'common';
import { StoreContext } from 'stores/StoreRoot';

import styles from '../Form.scss';

interface ErrorsProps {
  errors: FieldValidatorType[];
}

@observer
export class Errors extends React.Component<ErrorsProps> {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  render() {
    const { store } = this.context;
    const { errors } = this.props;

    if (errors.length === 0) return null;

    return (
      <div className={styles.errors}>
        {errors.map(({ message }) => (
          <div className={styles.errorItem} key={message.name}>
            {_.isPlainObject(message) ? store.getLn(message) : message}
          </div>
        ))}
      </div>
    );
  }
}
