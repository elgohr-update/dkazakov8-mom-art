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

export type EmptyClassType = { new (...args: any[]): Record<string, any> };

export type LooseFunctionType = (...args: any[]) => any;

export type MessageObjectType = { name: string; defaultValue: string };

export type FieldValidatorType = {
  notValidCheck: (params: { value: string }) => boolean;
  message: MessageObjectType;
};

export type ModalType = {
  id: string;
  name: string;
  status: string;

  data?: Record<string, any>;
};

export type NotificationType = {
  type: string;
  message: string;

  id?: string;
  delay?: number;
  status?: string;
  height?: number;
};

export interface Express {
  Request: {
    originalUrl: string;
    session: { language: string };
    acceptsLanguages: LooseFunctionType;
  };
  Response: {
    body: Record<string, any>;
    status: LooseFunctionType;
  };
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
