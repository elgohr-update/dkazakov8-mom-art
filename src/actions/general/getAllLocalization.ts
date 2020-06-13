import { TypeAction } from 'models';

export const getAllLocalization: TypeAction = ({ store, api }) => {
  return api
    .getAllLocalization()
    .then(({ translations }) => (store.admin.translations = translations));
};
