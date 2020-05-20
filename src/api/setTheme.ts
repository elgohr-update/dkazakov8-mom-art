import { ApiRoute } from '../models/ApiRoute';

type TypeRequestParams = {
  theme: string;
};

type TypeResponseParams = undefined;

type TypeApiRoute = ApiRoute & { params?: TypeRequestParams; response?: TypeResponseParams };

export const setTheme: TypeApiRoute = {
  name: `setTheme`,
  url: `/themes`,
  method: 'POST',
  isMocked: false,
};
