import { makeObservable } from 'utils';
import { ModalType, NotificationType, ValuesOfArrayType } from 'common';
import themes from 'styles/themes.scss';

type LightboxType = {
  elementsArray: any[];
  currentIndex: number;
  isRemoving: boolean;
};

const languagesList: ('ru' | 'en')[] = ['ru', 'en'];

@makeObservable
export class StoreUi {
  lnData: { [key: string]: string } = {};
  currentLanguage: ValuesOfArrayType<typeof languagesList> = 'ru';
  languagesList = languagesList;
  currentTheme = '';
  themeParams: { [key: string]: string } = {};
  themesList = Object.keys(themes);
  lightbox: LightboxType = {
    elementsArray: [],
    currentIndex: -1,
    isRemoving: false,
  };
  screen = {
    width: 0,
    height: 0,
  };
  modals: ModalType[] = [];
  notifications: NotificationType[] = [];
}
