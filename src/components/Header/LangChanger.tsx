import cn from 'classnames';
import React from 'react';

import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from './Header.scss';

@ConnectedComponent.observer
export class LangChanger extends ConnectedComponent {
  render() {
    const {
      actions,
      store: {
        ui: { currentLanguage, languagesList },
      },
    } = this.context;

    return (
      <>
        {languagesList
          .filter(language => language !== currentLanguage)
          .map(language => (
            <div
              key={language}
              className={cn(styles.languageToggler, language === currentLanguage && styles.active)}
              onClick={() => actions.general.getLocalization({ language })}
            >
              {language}
            </div>
          ))}
      </>
    );
  }
}
