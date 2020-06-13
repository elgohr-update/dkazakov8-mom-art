export interface TypeGalleryItem {
  id: string;
  title: {
    ru: string;
    en: string;
  };
  sources: {
    big: {
      src: string;
      width: number;
      height: number;
    };
    small: {
      src: string;
      width: number;
      height: number;
    };
  };
}

export type TypeGalleryItems = TypeGalleryItem[];
