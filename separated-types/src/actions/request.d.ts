import { ActionFirstParams } from 'models';
export declare function validateRequestParams({ route, params }: {
    route: any;
    params: any;
}): Promise<any>;
export declare function request({ store, req, res }: ActionFirstParams, route: any, params: any): Promise<any>;
