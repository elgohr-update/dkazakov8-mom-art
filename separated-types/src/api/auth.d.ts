import { ApiRoute } from '../models/ApiRoute';
declare type TypeRequestParams = {
    email: string;
    password: string;
};
declare type TypeResponseParams = {
    email: string;
    sessionExpires: number;
};
declare type TypeApiRoute = ApiRoute & {
    params?: TypeRequestParams;
    response?: TypeResponseParams;
};
export declare const auth: TypeApiRoute;
export {};
