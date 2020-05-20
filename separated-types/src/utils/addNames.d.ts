declare type ObjectWithNamesType<T> = {
    [Key in keyof T]: T[Key] & {
        name: string;
    };
};
export declare function addNames<ObjectType>(obj: ObjectType): ObjectWithNamesType<ObjectType>;
export {};
