// @ts-nocheck

import { validators } from 'utils/validateObject';
import { StoreRoot } from 'stores/StoreRoot';

const { isString, isArray } = validators;

type myType = {
  params: {
    id: string;
  };
  response: {
    images: typeof StoreRoot['gallery']['items'];
  };
};

export const deleteImage: myType = {
  name: `deleteImage`,
  url: `/delete_image`,
  method: 'POST',
  params: {
    id: isString,
  },
  response: {
    images: isArray,
  },
  mock: {},
  isMocked: false,
};
