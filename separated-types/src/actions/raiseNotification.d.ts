import { NotificationType } from 'common';
import { ActionFirstParams } from 'models';
export declare function raiseNotification({ store }: ActionFirstParams, params: NotificationType): Promise<void>;
