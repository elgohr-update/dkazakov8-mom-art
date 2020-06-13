import { ApiRoute } from 'models/ApiRoute';

type TypeRequestParams = {
  email: string;
  password: string;
};

type TypeResponse = {
  email: string;
  sessionExpires: number;
};

export const auth: ApiRoute & { params?: TypeRequestParams; response?: TypeResponse } = {
  name: `auth`,
  url: `/auth`,
  method: 'POST',
  isMocked: false,
};
