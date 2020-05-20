import { StoreRoot } from 'stores/StoreRoot';
export declare type RouteType = {
    path: string;
    name?: string;
    rights?: string;
    validators?: Record<string, any>[];
    beforeEnter?: (store: StoreRoot, route?: RouteType) => Promise<any>;
};
export interface RoutesType {
    [key: string]: RouteType;
}
