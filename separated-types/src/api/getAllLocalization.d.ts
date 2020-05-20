import { ApiRoute } from '../models/ApiRoute';
declare type TypeRequestParams = undefined;
declare type TypeResponseParams = {
    translations: any;
};
declare type TypeApiRoute = ApiRoute & {
    params?: TypeRequestParams;
    response?: TypeResponseParams;
};
export declare const getAllLocalization: TypeApiRoute;
export {};
