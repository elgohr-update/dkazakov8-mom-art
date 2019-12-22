import _ from 'lodash';
import cn from 'classnames';
import React from 'react';

import { icons } from 'assets/icons';
import { connectComponent } from 'utils';
import { ConnectedProps } from 'commonUnsafe';

import styles from './Icon.scss';

interface IconProps {
  id?: string;
  glyph: string;
  onClick?: any;
  className?: string;
}

@connectComponent
export class Icon extends React.Component<ConnectedProps & IconProps> {
  static glyphs: typeof icons;

  render() {
    const { glyph, className, ...props } = this.props;
    const iconContent = icons[glyph];

    if (!iconContent) console.error(`Icon: no icon for glyph ${glyph}`);

    return !iconContent ? null : (
      <div
        {...props}
        className={cn(styles.icon, className)}
        dangerouslySetInnerHTML={{ __html: iconContent }}
      />
    );
  }
}

Icon.glyphs = _.mapValues(icons, (_value, key) => key);
