import { ApiRoute } from 'models/ApiRoute';

type TypeRequestParams = {
  formData: any;
};

type TypeResponse = undefined;

export const saveAllLocalization: ApiRoute & {
  params?: TypeRequestParams;
  response?: TypeResponse;
} = {
  name: `saveAllLocalization`,
  url: `/save_all_localization`,
  method: 'POST',
  isMocked: false,
};
