import { Express } from 'common';
import { StoreRoot } from 'stores/StoreRoot';
export declare function setLanguageToSession(params: {
    req: Express['Request'];
    store: StoreRoot;
}): Promise<void>;
