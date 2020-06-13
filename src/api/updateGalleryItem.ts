import { ApiRoute } from 'models/ApiRoute';
import { TypeGalleryItems } from 'models/TypeGalleryItems';

type TypeRequestParams = {
  id: string;
  order: number;
  title_ru: string;
  title_en: string;
};

type TypeResponse = {
  images: TypeGalleryItems;
};

export const updateGalleryItem: ApiRoute & {
  params?: TypeRequestParams;
  response?: TypeResponse;
} = {
  name: `updateGalleryItem`,
  url: `/update_gallery_item`,
  method: 'POST',
  isMocked: false,
};
