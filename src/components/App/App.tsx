import _ from 'lodash';
import cn from 'classnames';
import { IReactionDisposer, autorun } from 'mobx';

import { system } from 'const';
import { Router } from 'components/Router';
import { Modals } from 'components/Modals';
import { Lightbox } from 'components/Lightbox';
import { Notifications } from 'components/Notifications';
import { TypeGalleryItem } from 'models';
import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from './App.scss';

interface AppProps {
  onActionsFinished?: () => void;
}

@ConnectedComponent.observer
export class App extends ConnectedComponent<AppProps> {
  actionsFinishDisposer: IReactionDisposer;
  someActionsExecuted = false;
  someActionsExecutedCalled = false;

  UNSAFE_componentWillMount() {
    this.actionsFinishDisposer = autorun(this.detectActionsFinish);
  }

  componentWillUnmount() {
    this.actionsFinishDisposer();
  }

  detectActionsFinish = () => {
    const { actions, extendActions } = this.context;
    const { onActionsFinished } = this.props;

    if (!onActionsFinished || this.someActionsExecutedCalled) return;

    const loadingActions = [];

    Object.values(actions).forEach(actionsList =>
      Object.entries(actionsList).forEach(([actionName, actionFn]) => {
        if (
          actionFn?.data?.isExecuting &&
          !loadingActions.some(([aName]) => aName === actionName)
        ) {
          if (!this.someActionsExecuted) this.someActionsExecuted = true;
          loadingActions.push([actionName, actionFn.data.isExecuting]);
        }
      })
    );

    if (loadingActions.length === 0 && this.someActionsExecuted) {
      this.someActionsExecutedCalled = true;
      const mockedAction = () => Promise.resolve();

      extendActions(
        _.mapValues(actions, actionGroup => _.mapValues(actionGroup, () => mockedAction)),
        true
      );

      onActionsFinished();
    }
  };

  render() {
    const { store } = this.context;
    const transitionDuration = store.ui.modalIsOpen
      ? `${system.MODALS_LEAVING_TIMEOUT}ms`
      : undefined;

    return (
      <>
        <div
          className={cn(
            styles.app,
            store.ui.modalIsOpen && !store.ui.lastModalIsLeaving && styles.blurred,
            !store.ui.firstRendered && styles.invisible
          )}
          style={{ transitionDuration }}
        >
          <Router />
        </div>
        <Notifications />
        <Modals />
        <Lightbox srcGetter={(elem: TypeGalleryItem) => elem.sources.big.src} />
      </>
    );
  }
}
