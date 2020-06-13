import { ApiRoute } from 'models/ApiRoute';
import { TypeGalleryItems } from 'models/TypeGalleryItems';

type TypeRequestParams = undefined;

type TypeResponse = {
  images: TypeGalleryItems;
};

export const getImages: ApiRoute & { params?: TypeRequestParams; response?: TypeResponse } = {
  name: `getImages`,
  url: `/get_images`,
  method: 'POST',
  isMocked: false,
};
