import { getElementOffset } from './getElementOffset';

export function getHighestElementOffsetTop(idsArray: string[]) {
  const errorInputsOffsets = idsArray
    .map(id => document.getElementById(id))
    .filter(Boolean)
    .map(inputElement => getElementOffset(inputElement).top);

  return errorInputsOffsets.length === 0 ? null : Math.min(...errorInputsOffsets);
}
