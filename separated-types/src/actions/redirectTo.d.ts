import { Express } from 'common';
import { RouteType, ActionFirstParams } from 'models';
export declare function redirectTo({ store }: ActionFirstParams, params: {
    route?: RouteType;
    req?: Express['Request'];
    res?: Express['Response'];
}): Promise<any>;
