import { system } from 'const';

import { getHighestElementOffsetTop } from './getHighestElementOffsetTop';

export function scrollToFirstElement(idsArray: string[]) {
  const highestElementOffsetTop = getHighestElementOffsetTop(idsArray);

  if (highestElementOffsetTop != null) {
    const bodyScrollTop = highestElementOffsetTop - system.SPACE_BEFORE_INPUT_TOP_OFFSET;

    window.scrollTo(0, bodyScrollTop);
  }
}
