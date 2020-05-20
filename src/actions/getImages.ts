import { ActionFirstParams } from 'models';

export function getImages({ store }: ActionFirstParams) {
  return store.actions.api.getImages().then(data => (store.gallery.items = data.images));
}
