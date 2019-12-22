/**
 * @docs: https://webpack.js.org/configuration/mode
 *
 */
import { env } from '../../env';

export const configMode = env.getParam('NODE_ENV') === 'development' ? 'development' : 'production';
