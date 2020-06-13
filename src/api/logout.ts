import { ApiRoute } from 'models/ApiRoute';

type TypeRequestParams = undefined;

type TypeResponse = undefined;

export const logout: ApiRoute & { params?: TypeRequestParams; response?: TypeResponse } = {
  name: 'logout',
  url: `/logout`,
  method: 'POST',
  isMocked: false,
};
