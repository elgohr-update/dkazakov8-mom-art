import * as t from 'ts-interface-checker';
// tslint:disable:object-literal-key-quotes

export const TypeGalleryItem = t.iface([], {
  id: 'string',
  title: t.iface([], {
    ru: 'string',
    en: 'string',
  }),
  sources: t.iface([], {
    big: t.iface([], {
      src: 'string',
      width: 'number',
      height: 'number',
    }),
    small: t.iface([], {
      src: 'string',
      width: 'number',
      height: 'number',
    }),
  }),
});

export const TypeGalleryItems = t.array('TypeGalleryItem');

export const ApiRoute = t.iface([], {
  name: 'string',
  url: 'string',
  method: t.union(t.lit('GET'), t.lit('POST')),
  isFile: t.opt('boolean'),
  headers: t.opt('any'),
  isMocked: 'boolean',
});

export const TypeRequestParams = t.iface([], {
  id: 'string',
});

export const TypeResponse = t.iface([], {
  images: 'TypeGalleryItems',
});

const exportedTypeSuite: t.ITypeSuite = {
  TypeGalleryItem,
  TypeGalleryItems,
  ApiRoute,
  TypeRequestParams,
  TypeResponse,
};
export default exportedTypeSuite;
