import { generateId } from 'utils';
import { TypeAction, TypeModal } from 'models';

type Params = { name: TypeModal['name']; data?: TypeModal['data'] };

export const modalRaise: TypeAction<Params> = ({ store }, { name, data }) => {
  const { modals } = store.ui;

  const alreadyUsedIds = modals.map(({ id }) => id);
  const id = generateId({ excludedIds: alreadyUsedIds });

  const modal: TypeModal = {
    id,
    name,
    data,
    isLeaving: false,
    isEntering: true,
  };

  modals.push(modal);

  return Promise.resolve();
};
