import { ActionFirstParams } from 'models';
export declare function raiseModal({ store }: ActionFirstParams, params: {
    name: string;
    data?: Record<string, any>;
}): Promise<void>;
