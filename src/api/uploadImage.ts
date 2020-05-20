import { ApiRoute } from '../models/ApiRoute';
import { TypeGalleryItems } from '../models/GalleryItems';

type TypeRequestParams = undefined;

type TypeResponseParams = {
  images: TypeGalleryItems;
};

type TypeApiRoute = ApiRoute & { params?: TypeRequestParams; response?: TypeResponseParams };

export const uploadImage: TypeApiRoute = {
  name: `uploadImage`,
  url: `/upload_image`,
  method: 'POST',
  isFile: true,
  headers: {
    'Content-Type': `multipart/form-data`,
  },
  isMocked: false,
};
