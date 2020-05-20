import { ApiRoute } from '../models/ApiRoute';
declare type TypeRequestParams = {
    language: string;
};
declare type TypeResponseParams = {
    translations: any;
};
declare type TypeApiRoute = ApiRoute & {
    params?: TypeRequestParams;
    response?: TypeResponseParams;
};
export declare const getLocalization: TypeApiRoute;
export {};
