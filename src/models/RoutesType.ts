import { TypeGlobals } from './TypeGlobals';

export type RouteType = {
  path: string;

  name?: string;
  rights?: string;
  validators?: Record<string, any>[];
  beforeEnter?: (params: TypeGlobals & { route?: RouteType }) => Promise<any>;
};

export interface RoutesType {
  [key: string]: RouteType;
}
