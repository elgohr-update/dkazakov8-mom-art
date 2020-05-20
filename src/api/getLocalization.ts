import { ApiRoute } from '../models/ApiRoute';

type TypeRequestParams = {
  language: string;
};

type TypeResponseParams = {
  translations: any;
};

type TypeApiRoute = ApiRoute & { params?: TypeRequestParams; response?: TypeResponseParams };

export const getLocalization: TypeApiRoute = {
  name: `getLocalization`,
  url: `/get_current_localization`,
  method: 'POST',
  isMocked: false,
};
