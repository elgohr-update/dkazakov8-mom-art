import _ from 'lodash';
import cn from 'classnames';
import React from 'react';

import { connectComponent } from 'utils';
import { ConnectedProps } from 'commonUnsafe';

import { Icon } from '../Icon';

import styles from './Header.scss';

@connectComponent
export class LangChanger extends React.Component<ConnectedProps> {
  render() {
    const {
      store,
      store: {
        ui: { currentLanguage, languagesList },
      },
    } = this.props;

    return (
      <div className={styles.buttonsBlock}>
        {languagesList.map(language => (
          <Icon
            key={language}
            glyph={Icon.glyphs[`lang${_.capitalize(language)}`]}
            className={cn(styles.themeToggler, language === currentLanguage && styles.active)}
            onClick={() => store.actions.common.getLocalization({ language })}
          />
        ))}
      </div>
    );
  }
}
