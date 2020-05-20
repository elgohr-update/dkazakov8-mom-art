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

export const TypeRequestParams = t.name('undefined');

export const TypeResponseParams = t.name('undefined');

export const TypeApiRoute = t.intersection(
  'ApiRoute',
  t.iface([], {
    params: t.opt('TypeRequestParams'),
    response: t.opt('TypeResponseParams'),
  })
);

const exportedTypeSuite: t.ITypeSuite = {
  ApiRoute,
  TypeRequestParams,
  TypeResponseParams,
  TypeApiRoute,
};
export default exportedTypeSuite;
