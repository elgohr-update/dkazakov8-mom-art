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

export const TypeResponse = t.iface([], {
  translations: 'any',
});

const exportedTypeSuite: t.ITypeSuite = {
  ApiRoute,
  TypeRequestParams,
  TypeResponse,
};
export default exportedTypeSuite;
