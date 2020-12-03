import { isomorphPolyfills } from 'utils';
import { createServer, updateTranslations, copyAssetsToCDN } from 'Server/utils';
import { handleSession } from 'Server/middlewares/common/handleSession';
import { handlePrometheus } from 'Server/middlewares/common/handlePrometheus';
import { handleJsonRequests } from 'Server/middlewares/common/handleJsonRequests';
import { handleProtectionHeaders } from 'Server/middlewares/common/handleProtectionHeaders';
import { handleUrlencodedRequests } from 'Server/middlewares/common/handleUrlencodedRequests';
import { handleApiRoutes } from 'Server/middlewares/route/handleApiRoutes';
import { handleFileRoutes } from 'Server/middlewares/route/handleFileRoutes';
import { handlePageRoutes } from 'Server/middlewares/route/handlePageRoutes';
import { handleMissingRoutes } from 'Server/middlewares/route/handleMissingRoutes';

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
