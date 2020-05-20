import _ from 'lodash';
import cn from 'classnames';
import React from 'react';
import { observer } from 'mobx-react';

import { icons } from 'assets/icons';
import { StoreContext } from 'stores/StoreRoot';

import styles from './Icon.scss';

interface IconProps {
  id?: string;
  glyph: string;
  onClick?: any;
  className?: string;
}

@observer
export class Icon extends React.Component<IconProps> {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

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
