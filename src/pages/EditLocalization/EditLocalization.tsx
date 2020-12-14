import React from 'react';

import { fieldValidators } from 'utils';
import { Form } from 'components/Form';
import { Header } from 'components/Header';
import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from './EditLocalization.scss';
import { messages } from './messages';

interface TranslationItemProps {
  lang: string;
  storePath: string;
  defaultValue: string;
  translationName: string;
}

@ConnectedComponent.observer
class TranslationItem extends ConnectedComponent<TranslationItemProps> {
  render() {
    const {
      store: {
        admin: { translations },
      },
    } = this.context;
    const { lang, storePath, defaultValue, translationName } = this.props;

    const isTextarea = defaultValue.indexOf('textarea') === 0;
    const translationNameFormatted = translationName.replace('src/', '').replace('__', '.');

    return (
      <Form.Input.Text
        isTextarea={isTextarea}
        validators={[fieldValidators.emptyString]}
        storePath={`${storePath}.${translationName}-${lang}`}
        label={`${translationNameFormatted} [${defaultValue}] - ${lang}`}
        defaultValue={translations[translationName][lang]}
      />
    );
  }
}

@ConnectedComponent.observer
export default class EditLocalization extends ConnectedComponent {
  UNSAFE_componentWillMount() {
    const { actions } = this.context;

    actions.general.setMetaData({
      title: messages.metaTitle,
      description: messages.metaTitle,
    });
  }

  handleFormSubmit = formData => {
    const { actions } = this.context;

    const storePath = `admin.form`;

    return actions.general.saveAllLocalization({ formData, storePath });
  };

  render() {
    const {
      store: {
        ui: { languagesList },
        admin: { translations },
      },
    } = this.context;

    const storePath = `admin.form`;

    return (
      <>
        <Header />
        <div className={styles.translations}>
          <Form storePath={storePath} onSubmit={this.handleFormSubmit}>
            {Object.entries(translations).map(([translationName, { defaultValue }]) => (
              <div key={translationName} className={styles.item}>
                {languagesList.map(lang => (
                  <TranslationItem
                    key={lang}
                    lang={lang}
                    storePath={storePath}
                    defaultValue={defaultValue}
                    translationName={translationName}
                  />
                ))}
              </div>
            ))}
            <Form.Input.Submit label={messages.saveButton} />
          </Form>
        </div>
      </>
    );
  }
}
