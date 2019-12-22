type ObjectWithNamesType<T> = { [Key in keyof T]: T[Key] & { name: string } };

export function addNames<ObjectType>(obj: ObjectType): ObjectWithNamesType<ObjectType> {
  Object.entries(obj).forEach(([key, value]) => {
    value.name = key;
  });

  return obj as ObjectWithNamesType<ObjectType>;
}
