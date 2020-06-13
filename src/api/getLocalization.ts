import { ApiRoute } from 'models/ApiRoute';

type TypeRequestParams = {
  language: string;
};

type TypeResponse = {
  translations: any;
};

export const getLocalization: ApiRoute & { params?: TypeRequestParams; response?: TypeResponse } = {
  name: `getLocalization`,
  url: `/get_current_localization`,
  method: 'POST',
  isMocked: false,
};
