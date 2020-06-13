import { ApiRoute } from 'models/ApiRoute';

type TypeRequestParams = undefined;

type TypeResponse = {
  translations: any;
};

export const getAllLocalization: ApiRoute & {
  params?: TypeRequestParams;
  response?: TypeResponse;
} = {
  name: `getAllLocalization`,
  url: `/get_all_localization`,
  method: 'POST',
  isMocked: false,
};
