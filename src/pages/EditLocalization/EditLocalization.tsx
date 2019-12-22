import React from 'react';

import { connectComponent, fieldValidators } from 'utils';
import { Header } from 'components/Header';
import { Form } from 'components/Form';
import { ConnectedProps } from 'commonUnsafe';
import { StoreRoot } from 'stores/StoreRoot';

import styles from './EditLocalization.scss';
import { messages } from './messages';

interface TranslationItemProps {
  lang: string;
  storePath: string;
  defaultValue: string;
  translationName: string;
}

@connectComponent
class TranslationItem extends React.Component<ConnectedProps & TranslationItemProps> {
  render() {
    const {
      lang,
      storePath,
      defaultValue,
      translationName,
      store: {
        admin: { translations },
      },
    } = this.props;

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

@connectComponent
export class EditLocalization extends React.Component<ConnectedProps> {
  static meta = (store: StoreRoot) => ({
    title: store.getLn(messages.metaTitle),
  });

  handleFormSubmit = formData => {
    const { store } = this.props;

    const storePath = `admin.form`;

    return store.actions.common.saveAllLocalization({ formData, storePath });
  };

  render() {
    const {
      store: {
        ui: { languagesList },
        admin: { translations },
      },
    } = this.props;

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
