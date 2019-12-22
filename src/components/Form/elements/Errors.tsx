import _ from 'lodash';
import React from 'react';

import { connectComponent } from 'utils';
import { FieldValidatorType } from 'common';
import { ConnectedProps } from 'commonUnsafe';

import styles from '../Form.scss';

interface ErrorsProps {
  errors: FieldValidatorType[];
}

@connectComponent
export class Errors extends React.Component<ConnectedProps & ErrorsProps> {
  render() {
    const { store, errors } = this.props;

    if (errors.length === 0) {
      return null;
    }

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
