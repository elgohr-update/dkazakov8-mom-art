import { RouteType } from 'models';
declare type MetaDataType = {
    title?: string;
    description?: string;
};
export declare class StoreRouter {
    currentRoute: RouteType;
    metaData: MetaDataType;
}
export {};
