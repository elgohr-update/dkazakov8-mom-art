/* eslint-disable init-declarations */

interface Window {
  INITIAL_DATA: Record<string, any>;
  MEASURES: string;
}

interface Array<T> {
  /**
   * Allows checking elements in typed arrays like
   *
   * const languagesList: ('ru' | 'en')[] = ['ru', 'en'];
   * languagesList.includes(someParam)
   */
  includes<U extends T extends U ? unknown : never>(searchElement: U, fromIndex?: number): boolean;
}

interface Console {
  js: (...args: any[]) => void;
}

declare module '*.scss' {
  export const content: { [className: string]: string };
  export default content;
}

declare module 'styles/themes.scss' {
  export const content: { [className: string]: { [customCssVariable: string]: string } };
  export default content;
}

declare module '*.jpg';

declare const IS_CLIENT: boolean;
declare const HOT_RELOAD: boolean;
declare const SENTRY_URL: string;
