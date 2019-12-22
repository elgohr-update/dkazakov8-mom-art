import { validators } from 'utils/validateObject';

const { isArray } = validators;

export const uploadImage = {
  name: `uploadImage`,
  url: `/upload_image`,
  method: 'POST',
  isFile: true,
  headers: {
    'Content-Type': `multipart/form-data`,
  },
  params: {},
  response: {
    images: isArray,
  },
  mock: {},
  isMocked: false,
};
