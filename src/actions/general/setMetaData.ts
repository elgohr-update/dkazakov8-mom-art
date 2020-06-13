import { TypeAction } from 'models';
import { MessageObjectType } from 'common';

type Params = { title: MessageObjectType; description: MessageObjectType };

export const setMetaData: TypeAction<Params> = ({ store }, params) => {
  const { title, description } = params;

  store.router.metaData = {
    title: store.getLn(title),
    description: store.getLn(description),
  };

  return Promise.resolve();
};
