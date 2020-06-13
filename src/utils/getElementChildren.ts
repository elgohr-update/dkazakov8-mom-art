export function getElementChildren({
  element,
  exclude,
}: {
  element: HTMLElement;
  exclude?: (el: HTMLElement) => boolean;
}): HTMLElement[] {
  const elementChildren = [...element.childNodes] as HTMLElement[];

  return exclude ? elementChildren.filter(exclude) : elementChildren;
}
