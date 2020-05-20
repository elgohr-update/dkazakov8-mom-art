import { ActionFirstParams } from 'models';
export declare function getLocalization({ store }: ActionFirstParams, { language }: {
    language: any;
}): Promise<void>;
export declare function getLocalizationSuccess({ store }: ActionFirstParams, { language, translations }: {
    language: any;
    translations: any;
}): Promise<void>;
