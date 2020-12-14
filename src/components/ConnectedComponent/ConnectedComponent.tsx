import { Component, ContextType } from 'react';
import { observer } from 'mobx-react';

import { StoreContext } from 'components/StoreContext';

export class ConnectedComponent<Props = any> extends Component<Props> {
  static observer = observer;
  static context: ContextType<typeof StoreContext>;
  static contextType = StoreContext;
  declare context: typeof ConnectedComponent['context'];
}
