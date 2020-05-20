import { ActionFirstParams } from 'models';

export function getAllLocalization({ store }: ActionFirstParams) {
  return store.actions.api
    .getAllLocalization()
    .then(({ translations }) => (store.admin.translations = translations));
}
