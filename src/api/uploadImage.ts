import { ApiRoute } from 'models/ApiRoute';
import { TypeGalleryItems } from 'models/TypeGalleryItems';

type TypeRequestParams = any;

type TypeResponse = {
  images: TypeGalleryItems;
};

export const uploadImage: ApiRoute & { params?: TypeRequestParams; response?: TypeResponse } = {
  name: `uploadImage`,
  url: `/upload_image`,
  method: 'POST',
  isMocked: false,
};
