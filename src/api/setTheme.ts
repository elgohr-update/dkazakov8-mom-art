import { ApiRoute } from 'models/ApiRoute';

type TypeRequestParams = {
  theme: string;
};

type TypeResponse = undefined;

export const setTheme: ApiRoute & { params?: TypeRequestParams; response?: TypeResponse } = {
  name: `setTheme`,
  url: `/themes`,
  method: 'POST',
  isMocked: false,
};
