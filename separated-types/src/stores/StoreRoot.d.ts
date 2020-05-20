import React from 'react';
import { getLn } from 'utils';
import { SkipFirstArgType, Express } from 'common';
import * as api from 'api';
import * as actions from 'actions';
import { StoreUi } from './StoreUi';
import { StoreUser } from './StoreUser';
import { StoreAdmin } from './StoreAdmin';
import { StoreRouter } from './StoreRouter';
import { StoreGallery } from './StoreGallery';
export declare type StoreConstructorParams = {
    req?: Express['Request'];
    res?: Express['Response'];
};
declare type Actions = {
    api: {
        [FnName in keyof typeof api]: (...args: Array<typeof api[FnName]['params']>) => Promise<typeof api[FnName]['response']>;
    };
    common: {
        [FnName in keyof typeof actions]: SkipFirstArgType<typeof actions[FnName]>;
    };
};
declare type Executions = {
    api: {
        [FnName in keyof typeof api]: boolean;
    };
    common: {
        [FnName in keyof typeof actions]: boolean;
    };
};
export declare class StoreRoot {
    actions: Actions;
    executions: Executions;
    ui: StoreUi;
    user: StoreUser;
    admin: StoreAdmin;
    router: StoreRouter;
    gallery: StoreGallery;
    getLn: SkipFirstArgType<typeof getLn>;
    getters: Record<string, any>;
    constructor(params: StoreConstructorParams);
}
export declare const StoreContext: React.Context<{
    store: StoreRoot;
}>;
export {};
