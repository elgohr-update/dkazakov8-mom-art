export declare type Writeable<Type extends {
    [x: string]: any;
}, Key extends string> = {
    [P in Key]: Type[P];
};
export declare type ValueOf<T> = T[keyof T];
export declare type ValuesOfArrayType<T extends any[]> = T[number];
export declare type SkipFirstArgType<FunctionType> = FunctionType extends (params: infer FirstArgument, ...args: infer OtherArguments) => infer ResultType ? (...args: OtherArguments) => ResultType : unknown;
export declare type EmptyClassType = {
    new (...args: any[]): Record<string, any>;
};
export declare type LooseFunctionType = (...args: any[]) => any;
export declare type MessageObjectType = {
    name: string;
    defaultValue: string;
};
export declare type FieldValidatorType = {
    notValidCheck: (params: {
        value: string;
    }) => boolean;
    message: MessageObjectType;
};
export declare type ModalType = {
    id: string;
    name: string;
    status: string;
    data?: Record<string, any>;
};
export declare type NotificationType = {
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
            language: string;
        };
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
