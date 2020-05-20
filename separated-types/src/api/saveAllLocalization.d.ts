import { ApiRoute } from '../models/ApiRoute';
declare type TypeRequestParams = {
    formData: any;
};
declare type TypeResponseParams = undefined;
declare type TypeApiRoute = ApiRoute & {
    params?: TypeRequestParams;
    response?: TypeResponseParams;
};
export declare const saveAllLocalization: TypeApiRoute;
export {};
