import { ApiRoute } from '../models/ApiRoute';

type TypeRequestParams = undefined;

type TypeResponseParams = undefined;

type TypeApiRoute = ApiRoute & { params?: TypeRequestParams; response?: TypeResponseParams };

export const logout: TypeApiRoute = {
  name: 'logout',
  url: `/logout`,
  method: 'POST',
  isMocked: false,
};
