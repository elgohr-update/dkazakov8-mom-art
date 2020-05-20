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

export const TypeRequestParams = t.iface([], {
  id: 'string',
  order: 'string',
  title_ru: 'string',
  title_en: 'string',
});

export const TypeResponseParams = t.iface([], {
  images: 'TypeGalleryItems',
});

export const TypeApiRoute = t.intersection(
  'ApiRoute',
  t.iface([], {
    params: t.opt('TypeRequestParams'),
    response: t.opt('TypeResponseParams'),
  })
);

const exportedTypeSuite: t.ITypeSuite = {
  ApiRoute,
  TypeGalleryItem,
  TypeGalleryItems,
  TypeRequestParams,
  TypeResponseParams,
  TypeApiRoute,
};
export default exportedTypeSuite;
