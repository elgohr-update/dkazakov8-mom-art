import { ApiRoute } from '../models/ApiRoute';
import { TypeGalleryItems } from '../models/GalleryItems';
declare type TypeRequestParams = {
    id: string;
    order: string;
    title_ru: string;
    title_en: string;
};
declare type TypeResponseParams = {
    images: TypeGalleryItems;
};
declare type TypeApiRoute = ApiRoute & {
    params?: TypeRequestParams;
    response?: TypeResponseParams;
};
export declare const updateGalleryItem: TypeApiRoute;
export {};
