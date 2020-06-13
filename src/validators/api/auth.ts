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

export const TypeRequestParams = t.iface([], {
  email: 'string',
  password: 'string',
});

export const TypeResponse = t.iface([], {
  email: 'string',
  sessionExpires: 'number',
});

const exportedTypeSuite: t.ITypeSuite = {
  ApiRoute,
  TypeRequestParams,
  TypeResponse,
};
export default exportedTypeSuite;
