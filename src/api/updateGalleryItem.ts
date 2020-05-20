import { ApiRoute } from '../models/ApiRoute';
import { TypeGalleryItems } from '../models/GalleryItems';

type TypeRequestParams = {
  id: string;
  order: string;
  title_ru: string;
  title_en: string;
};

type TypeResponseParams = {
  images: TypeGalleryItems;
};

type TypeApiRoute = ApiRoute & { params?: TypeRequestParams; response?: TypeResponseParams };

export const updateGalleryItem: TypeApiRoute = {
  name: `updateGalleryItem`,
  url: `/update_gallery_item`,
  method: 'POST',
  isMocked: false,
};
