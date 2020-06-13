import * as t from 'ts-interface-checker';
// tslint:disable:object-literal-key-quotes

export const ApiRoute = t.iface([], {
  name: 'string',
  url: 'string',
  method: t.union(t.lit('GET'), t.lit('POST')),
  isFile: t.opt('boolean'),
  headers: t.opt('any'),
  isMocked: 'boolean',
});

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

export const TypeRequestParams = t.name('any');

export const TypeResponse = t.iface([], {
  images: 'TypeGalleryItems',
});

const exportedTypeSuite: t.ITypeSuite = {
  ApiRoute,
  TypeGalleryItem,
  TypeGalleryItems,
  TypeRequestParams,
  TypeResponse,
};
export default exportedTypeSuite;
