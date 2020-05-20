import _ from 'lodash';

export function getNotValidFieldsIds({ formConfig }) {
  return _.values(formConfig)
    .filter(fieldData => !fieldData.isValidFn())
    .map(fieldData => fieldData.id);
}
