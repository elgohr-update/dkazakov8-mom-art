import { ActionFirstParams } from 'models';
export declare function changeLightbox({ store }: ActionFirstParams, params: {
    direction?: string;
    index?: number;
    elements?: any[];
    bigLoadedIndex?: number;
}): Promise<void>;
