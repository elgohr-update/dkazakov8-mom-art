export function getElementVerticalPaddings({ element }: { element: HTMLElement }): number {
  const elementStyle = window.getComputedStyle(element, null);

  return (
    parseFloat(elementStyle.getPropertyValue('padding-top')) +
    parseFloat(elementStyle.getPropertyValue('padding-bottom'))
  );
}
