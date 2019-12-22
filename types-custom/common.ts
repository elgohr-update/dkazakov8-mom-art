import { StoreRoot } from 'stores/StoreRoot';

export type Writeable<Type extends { [x: string]: any }, Key extends string> = {
  [P in Key]: Type[P];
};

export type ValueOf<T> = T[keyof T];

export type ValuesOfArrayType<T extends any[]> = T[number];

export type SkipFirstArgType<FunctionType> = FunctionType extends (
  params: infer FirstArgument,
  ...args: infer OtherArguments
) => infer ResultType
  ? (...args: OtherArguments) => ResultType
  : unknown;

export type EmptyClassType = { new (...args: any[]): {} };

export type LooseFunctionType = (...args: any[]) => any;

export type MessageObjectType = { name: string; defaultValue: string };

export type FieldValidatorType = {
  notValidCheck: (params: { value: string }) => boolean;
  message: MessageObjectType;
};

export type RouteType = {
  path: string;

  name?: string;
  rights?: string;
  validators?: object[];
  beforeEnter?: (store: StoreRoot, route?: RouteType) => Promise<any>;
};

export interface RoutesType {
  [key: string]: RouteType;
}

export type ModalType = {
  id: string;
  name: string;
  status: string;

  data?: object;
};

export type NotificationType = {
  type: string;
  message: string;

  id?: string;
  delay?: number;
  status?: string;
  height?: number;
};

export namespace Express {
  export interface Request {
    originalUrl: string;
    session: { language: string };
    acceptsLanguages: LooseFunctionType;
  }
  export interface Response {
    body: object;
    status: LooseFunctionType;
  }
}

export interface FormFileType {
  /** filename  */
  filename: string;
  /** content-type header value of file */
  type: string;
  /** byte size of file */
  size: number;
  /** in-memory content of file. Either content or tempfile is set  */
  content?: Uint8Array;
  /** temporal file path.
   * Set if file size is bigger than specified max-memory size at reading form
   * */
  tempfile?: string;
}
