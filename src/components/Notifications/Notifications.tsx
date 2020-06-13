import cn from 'classnames';
import React from 'react';

import { generateArray } from 'utils';
import { Icon } from 'components/Icon';
import { ConnectedComponent } from 'components/ConnectedComponent';

import styles from './Notifications.scss';

interface NotificationProps {
  id: string;
  type: string;
  height: number;
  status: string;
  message: string;
  prevElementsHeight: number;
}

/**
 * How notifications work:
 *
 * 1. Some code calls store.raiseNotification so new notification object
 * is added to store.ui.notifications
 *
 * 2. Dom element is mounted with zero opacity and after first render it's
 * real height is added to notification object
 *
 * 3. Dom element becomes visible with top offset calculated by sum of
 * previous notifications' heights
 *
 * 4. When it's time to remove notification, it's status at first becomes
 * 'leaving', so dom element becomes fading; after transition end notification object
 * is removed from store.ui.notifications
 *
 * 5. Top offset for other notifications is recalculated, and they smoothly
 * fly to their new position (optimized by using 'translateY' instead of 'top'
 * transition)
 *
 */

@ConnectedComponent.observer
class Notification extends ConnectedComponent<NotificationProps> {
  ref = null;

  componentDidMount() {
    const { store } = this.context;
    const { id } = this.props;
    const { notifications } = store.ui;

    const notificationObservable = notifications.find(n => id === n.id);

    /**
     * Modify just one property, so no need to create an action in store
     * for transactional change. Maybe I am just lazy :)
     *
     */

    notificationObservable.height = this.ref.offsetHeight;
  }

  render() {
    const { actions } = this.context;
    const { id, status, type, height, message, prevElementsHeight } = this.props;

    const className = cn({
      [styles.notification]: true,
      [styles[type]]: true,
      [styles.visible]: Boolean(height),
      // There is no .entering class in styles because it's not needed
      [styles[status]]: Boolean(styles[status]),
    });

    const style = {
      transform: `translateY(${prevElementsHeight}px)`,
    };

    return (
      <div className={className} style={style} ref={node => (this.ref = node)}>
        <div className={styles.notificationInner}>
          <Icon
            glyph={Icon.glyphs.close}
            className={styles.close}
            onClick={() => actions.general.removeNotification({ id })}
          />
          {message}
        </div>
      </div>
    );
  }
}

@ConnectedComponent.observer
export class Notifications extends ConnectedComponent {
  render() {
    const {
      store: {
        ui: { notifications },
      },
    } = this.context;

    return (
      <div className={styles.notifications}>
        {notifications.map((notification, index) => {
          const prevElementsHeight = generateArray(index).reduce(
            (num, i) => num + (notifications[i].height || 0),
            0
          );

          /**
           * Don't pass the whole notification observable, because it will
           * lead to lots of rerenders (Notification component will start
           * listening to changes, but it should not)
           *
           */

          return (
            <Notification
              id={notification.id}
              key={notification.id}
              type={notification.type}
              height={notification.height}
              status={notification.status}
              message={notification.message}
              prevElementsHeight={prevElementsHeight}
            />
          );
        })}
      </div>
    );
  }
}
