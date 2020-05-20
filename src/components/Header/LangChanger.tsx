import _ from 'lodash';
import cn from 'classnames';
import React from 'react';
import { observer } from 'mobx-react';

import { StoreContext } from 'stores/StoreRoot';

import { Icon } from '../Icon';

import styles from './Header.scss';

@observer
export class LangChanger extends React.Component {
  declare context: React.ContextType<typeof StoreContext>;
  static contextType = StoreContext;

  render() {
    const {
      store,
      store: {
        ui: { currentLanguage, languagesList },
      },
    } = this.context;

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
