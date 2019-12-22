import { ActionFirstParams } from 'commonUnsafe';

export function getAllLocalization({ store }: ActionFirstParams) {
  return store.actions.api
    .getAllLocalization()
    .then(({ translations }) => (store.admin.translations = translations));
}
