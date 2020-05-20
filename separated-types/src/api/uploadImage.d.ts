import { ApiRoute } from '../models/ApiRoute';
import { TypeGalleryItems } from '../models/GalleryItems';
declare type TypeRequestParams = undefined;
declare type TypeResponseParams = {
    images: TypeGalleryItems;
};
declare type TypeApiRoute = ApiRoute & {
    params?: TypeRequestParams;
    response?: TypeResponseParams;
};
export declare const uploadImage: TypeApiRoute;
export {};
