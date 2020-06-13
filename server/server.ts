import { isomorphPolyfills } from 'utils';
import { createServer, updateTranslations, copyAssetsToCDN } from 'serverUtils';
import { handleSession } from 'serverMiddlewares/handleSession';
import { handlePrometheus } from 'serverMiddlewares/handlePrometheus';
import { handleJsonRequests } from 'serverMiddlewares/handleJsonRequests';
import { handleProtectionHeaders } from 'serverMiddlewares/handleProtectionHeaders';
import { handleUrlencodedRequests } from 'serverMiddlewares/handleUrlencodedRequests';
import { handleApiRoutes } from 'routeMiddlewares/handleApiRoutes';
import { handleFileRoutes } from 'routeMiddlewares/handleFileRoutes';
import { handlePageRoutes } from 'routeMiddlewares/handlePageRoutes';
import { handleMissingRoutes } from 'routeMiddlewares/handleMissingRoutes';

isomorphPolyfills();

Promise.resolve()
  .then(updateTranslations)
  .then(copyAssetsToCDN)
  .then(() => createServer())
  .then(server =>
    server.useMiddlewares([
      /**
       * The order is meaningful.
       *
       * 1. look for the assets (if req.originalUrl has '.') and send 404 when not found
       * 2. Handle routes from "const/apiRoutes" (POST/GET/PUT etc.)
       * 3. Handle all GET requests (send template.html with rendered markup and window.INITIAL_DATA
       * included for store hydration on client).
       * When route is not found just send rendered markup of 404 page (no default redirects).
       * When error occurred send rendered markup of 500 page (also no default redirects).
       * 4. For all missing POST/PUT etc. requests send 404 with JSON
       * {"errorName":"NOT_FOUND","errorMessage":"Route [method] [url] was not found"}
       *
       */
      handleFileRoutes,

      handlePrometheus,
      handleProtectionHeaders,
      handleSession,
      handleJsonRequests,
      handleUrlencodedRequests,

      handleApiRoutes,
      handlePageRoutes,
      handleMissingRoutes,
    ])
  )
  .then(server => server.start())
  .catch(error => {
    console.error(error);

    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
