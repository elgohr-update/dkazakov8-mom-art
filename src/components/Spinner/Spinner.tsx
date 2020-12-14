import cn from 'classnames';
import { Component } from 'react';

import styles from './Spinner.scss';

interface SpinnerProps {
  className?: string;
  size: number;
}

export class Spinner extends Component<SpinnerProps> {
  render() {
    const { className, size } = this.props;

    const style = {
      width: `${size}px`,
      height: `${size}px`,
      marginTop: `-${Math.floor(size / 2)}px`,
      marginLeft: `-${Math.floor(size / 2)}px`,
    };

    return <div style={style} className={cn(styles.spinner, className)} />;
  }
}
