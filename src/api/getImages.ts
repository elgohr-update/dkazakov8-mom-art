import { validators } from 'utils/validateObject';

const { isString, isArrayShape, isPlainObject } = validators;

export const getImages = {
  name: `getImages`,
  url: `/get_images`,
  method: 'POST',
  params: {},
  response: {
    images: isArrayShape({
      id: isString,
      title: isPlainObject,
      sources: isPlainObject,
    }),
  },
  mock: {},
  isMocked: false,
};
