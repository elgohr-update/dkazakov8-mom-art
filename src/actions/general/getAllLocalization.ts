import { TypeAction } from 'models';

export const getAllLocalization: TypeAction = ({ store, api }) =>
  api.getAllLocalization().then(({ translations }) => (store.admin.translations = translations));
