export function sumElementsHeights({ elements }: { elements: HTMLElement[] }): number {
  return elements.reduce((acc, el) => acc + el.offsetHeight, 0);
}
