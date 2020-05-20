import { ApiRoute } from '../models/ApiRoute';

type TypeRequestParams = {
  email: string;
  password: string;
};

type TypeResponseParams = {
  email: string;
  sessionExpires: number;
};

type TypeApiRoute = ApiRoute & { params?: TypeRequestParams; response?: TypeResponseParams };

export const auth: TypeApiRoute = {
  name: `auth`,
  url: `/auth`,
  method: 'POST',
  isMocked: false,
};
