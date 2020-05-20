export type ApiRoute = {
  name: string;
  url: string;
  method: 'GET' | 'POST';
  isFile?: boolean;
  headers?: any;
  isMocked: boolean;
};
