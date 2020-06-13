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
  notValidCheck: (params: { value: any }) => boolean;
  message: MessageObjectType;
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
    session: {
      language?: 'ru' | 'en';
      theme?: string;
      email?: string;
      cookie: {
        expires: Date;
      };
    };
    acceptsLanguages: LooseFunctionType;
  };
  Response: {
    body: Record<string, any>;
    status: LooseFunctionType;
  };
}
