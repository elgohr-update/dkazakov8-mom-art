import _ from 'lodash';

import { MessageObjectType } from 'common';
import { StoreRoot } from 'stores/StoreRoot';

const showNoTextMessage = false;

const notLocalizedObject: { [key: string]: string } = {};
let showTimeout: number = null;

// declOfNum(count, ['найдена', 'найдено', 'найдены']);
function declOfNum(n: number, titles: string[]) {
  return titles[
    n % 10 === 1 && n % 100 !== 11
      ? 0
      : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? 1
      : 2
  ];
}

function replaceDynamicParams(
  values: { [key: string]: string | number },
  formattedMessage: string
) {
  if (!_.isPlainObject(values)) {
    return formattedMessage;
  }

  let messageWithValues = formattedMessage;

  Object.entries(values).forEach(([paramName, value]) => {
    messageWithValues = messageWithValues.replace(`{${paramName}}`, String(value));
  });

  return messageWithValues;
}

function replacePlurals(values: { [key: string]: string | number }, formattedMessage: string) {
  if (!_.isPlainObject(values)) {
    return formattedMessage;
  }

  let messageWithPlurals = formattedMessage;

  Object.entries(values).forEach(([paramName, value]) => {
    const pluralPattern = new RegExp(`{${paramName}:\\s([^}]*)}`);
    const pluralMatch = formattedMessage.match(pluralPattern);

    if (pluralMatch && pluralMatch[1]) {
      messageWithPlurals = formattedMessage.replace(
        pluralPattern,
        declOfNum(value as number, pluralMatch[1].split(','))
      );
    }
  });

  return messageWithPlurals;
}

export function getLn(
  { store }: { store: StoreRoot },
  // type string is for IDE jumping, the real is MessageObjectType
  messageObject: string | MessageObjectType,
  values?: { [key: string]: string | number }
) {
  const {
    ui: { lnData, currentLanguage },
  } = store;

  if (!_.isPlainObject(messageObject)) {
    console.error(`getLn: incorrect messageObject`);

    return '';
  }

  // @ts-ignore
  const { name, defaultValue } = messageObject;

  let localizedText = lnData[name];
  localizedText = localizedText === 'EMPTY' ? null : localizedText;

  if (localizedText == null && showNoTextMessage) {
    notLocalizedObject[name] = defaultValue;

    clearTimeout(showTimeout);
    showTimeout = setTimeout(() => {
      console.error(
        `useLocalization: no localization for lang ${currentLanguage}`,
        JSON.stringify(notLocalizedObject, null, 2)
      );
    });
  }

  let formattedMessage = localizedText || defaultValue || '';
  formattedMessage = replaceDynamicParams(values, formattedMessage);
  formattedMessage = replacePlurals(values, formattedMessage);

  return formattedMessage;
}
