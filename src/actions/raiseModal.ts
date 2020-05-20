import { generateId } from 'utils';
import { ModalType } from 'common';
import { ActionFirstParams } from 'models';

export function raiseModal(
  { store }: ActionFirstParams,
  params: { name: string; data?: Record<string, any> }
) {
  const { name, data } = params;
  const { modals } = store.ui;

  const alreadyUsedIds = modals.map(({ id }) => id);
  const id = generateId({ excludedIds: alreadyUsedIds });

  const modal: ModalType = {
    id,
    name,
    data,
    status: 'entering',
  };

  modals.push(modal);

  return Promise.resolve();
}
