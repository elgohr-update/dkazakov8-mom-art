export function generateId({ excludedIds }: { excludedIds: string[] }): string {
  const id = String(Math.random()).replace('.', '');
  const idIsAlreadyUsed = excludedIds.indexOf(id) !== -1;

  return idIsAlreadyUsed ? generateId({ excludedIds }) : id;
}
