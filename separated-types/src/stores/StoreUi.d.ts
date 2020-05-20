import { ModalType, NotificationType, ValuesOfArrayType } from 'common';
declare type LightboxType = {
    elementsArray: any[];
    currentIndex: number;
    isRemoving: boolean;
};
declare const languagesList: ('ru' | 'en')[];
export declare class StoreUi {
    lnData: {
        [key: string]: string;
    };
    currentLanguage: ValuesOfArrayType<typeof languagesList>;
    languagesList: ("ru" | "en")[];
    currentTheme: string;
    themeParams: {
        [key: string]: string;
    };
    themesList: string[];
    lightbox: LightboxType;
    screen: {
        width: number;
        height: number;
    };
    modals: ModalType[];
    notifications: NotificationType[];
}
export {};
