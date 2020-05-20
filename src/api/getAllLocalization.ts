import { ApiRoute } from '../models/ApiRoute';

type TypeRequestParams = undefined;

type TypeResponseParams = {
  translations: any;
};

type TypeApiRoute = ApiRoute & { params?: TypeRequestParams; response?: TypeResponseParams };

export const getAllLocalization: TypeApiRoute = {
  name: `getAllLocalization`,
  url: `/get_all_localization`,
  method: 'POST',
  isMocked: false,
};
