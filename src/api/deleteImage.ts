import { TypeGalleryItems } from 'models/TypeGalleryItems';
import { ApiRoute } from 'models/ApiRoute';

type TypeRequestParams = {
  id: string;
};

type TypeResponse = {
  images: TypeGalleryItems;
};

export const deleteImage: ApiRoute & { params?: TypeRequestParams; response?: TypeResponse } = {
  name: `deleteImage`,
  url: `/delete_image`,
  method: 'POST',
  isMocked: false,
};
