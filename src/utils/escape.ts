import _ from 'lodash';

export function escapeAllStrings(item: Record<string, any> | string | string[]): any {
  if (_.isPlainObject(item)) {
    return _.mapValues(item as Record<string, any>, escapeAllStrings);
  } else if (_.isString(item)) {
    return _.escape(item as string);
  } else if (_.isArray(item)) {
    return (item as string[]).map(escapeAllStrings);
  }

  return item;
}

export function unescapeAllStrings(item: Record<string, any> | string | string[]): any {
  if (_.isPlainObject(item)) {
    return _.mapValues(item as Record<string, any>, unescapeAllStrings);
  } else if (_.isString(item)) {
    return _.unescape(item as string);
  } else if (_.isArray(item)) {
    return (item as string[]).map(unescapeAllStrings);
  }

  return item;
}
