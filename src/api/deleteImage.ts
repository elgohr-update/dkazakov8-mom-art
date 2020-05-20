import { ApiRoute } from '../models/ApiRoute';
import { TypeGalleryItems } from '../models/GalleryItems';

type TypeRequestParams = {
  id: string;
};

type TypeResponseParams = {
  images: TypeGalleryItems;
};

type TypeApiRoute = ApiRoute & { params?: TypeRequestParams; response?: TypeResponseParams };

export const deleteImage: TypeApiRoute = {
  name: `deleteImage`,
  url: `/delete_image`,
  method: 'POST',
  isMocked: false,
};
