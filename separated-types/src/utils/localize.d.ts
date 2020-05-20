import { MessageObjectType } from 'common';
import { StoreRoot } from 'stores/StoreRoot';
export declare function getLn({ store }: {
    store: StoreRoot;
}, messageObject: MessageObjectType, values?: {
    [key: string]: string | number;
}): string;
