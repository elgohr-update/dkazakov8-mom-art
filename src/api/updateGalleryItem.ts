import { validators } from 'utils/validateObject';

const { isString, isNumber, isArray } = validators;

export const updateGalleryItem = {
  name: `updateGalleryItem`,
  url: `/update_gallery_item`,
  method: 'POST',
  params: {
    id: isString,
    order: isNumber,
    title_ru: isString,
    title_en: isString,
  },
  response: {
    images: isArray,
  },
  mock: {},
  isMocked: false,
};
