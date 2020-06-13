import { makeAutoObservable } from 'mobx';

import { NotificationType, ValuesOfArrayType } from 'common';
import { TypeModals } from 'models/TypeModals';
import themes from 'styles/themes.scss';

type LightboxType = {
  elementsArray: any[];
  currentIndex: number;
  isRemoving: boolean;
};

const languagesList: ('ru' | 'en')[] = ['ru', 'en'];

export class StoreUi {
  constructor() {
    makeAutoObservable(this);
  }

  firstRendered = false;

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

  headerMenuOpened = false;

  screen = {
    width: 0,
    height: 0,
  };
  heights = {
    header: 0,
  };
  get isMobile() {
    return this.firstRendered && this.screen.width <= 1000;
  }

  notifications: NotificationType[] = [];

  modals: TypeModals = [];
  get modalIsOpen() {
    return this.modals.length > 0;
  }
  get lastModalIsLeaving() {
    return this.modalIsOpen && this.modals[0].isLeaving;
  }
}
