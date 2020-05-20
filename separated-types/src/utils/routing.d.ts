import { Express } from 'common';
import { RouteType } from 'models';
declare function findRouteByPathname({ pathname }: {
    pathname: string;
}): RouteType;
declare function setResponseStatus(params: {
    res: Express['Response'];
    route: RouteType;
}): void;
export declare const routing: {
    setResponseStatus: typeof setResponseStatus;
    findRouteByPathname: typeof findRouteByPathname;
};
export {};
