import { ApiRoute } from '../models/ApiRoute';
declare type TypeRequestParams = {
    theme: string;
};
declare type TypeResponseParams = undefined;
declare type TypeApiRoute = ApiRoute & {
    params?: TypeRequestParams;
    response?: TypeResponseParams;
};
export declare const setTheme: TypeApiRoute;
export {};
