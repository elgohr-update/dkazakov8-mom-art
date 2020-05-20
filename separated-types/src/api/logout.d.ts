import { ApiRoute } from '../models/ApiRoute';
declare type TypeRequestParams = undefined;
declare type TypeResponseParams = undefined;
declare type TypeApiRoute = ApiRoute & {
    params?: TypeRequestParams;
    response?: TypeResponseParams;
};
export declare const logout: TypeApiRoute;
export {};
