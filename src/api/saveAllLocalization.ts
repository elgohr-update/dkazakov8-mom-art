import { ApiRoute } from '../models/ApiRoute';

type TypeRequestParams = {
  formData: any;
};

type TypeResponseParams = undefined;

type TypeApiRoute = ApiRoute & { params?: TypeRequestParams; response?: TypeResponseParams };

export const saveAllLocalization: TypeApiRoute = {
  name: `saveAllLocalization`,
  url: `/save_all_localization`,
  method: 'POST',
  isMocked: false,
};
