import { Component, ContextType } from 'react';
import { observer } from 'mobx-react';

import { StoreContext } from 'components/StoreContext';

export class ConnectedComponent<Props = any> extends Component<Props> {
  // SSR does not need to recalculate components on observable updates
  static observer = IS_CLIENT ? observer : SomeComponent => SomeComponent;
  static context: ContextType<typeof StoreContext>;
  static contextType = StoreContext;
  declare context: typeof ConnectedComponent['context'];
}
