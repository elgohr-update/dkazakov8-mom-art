import { env } from '../../env';

export const commitHash = env.getParam('GIT_COMMIT').trim();
