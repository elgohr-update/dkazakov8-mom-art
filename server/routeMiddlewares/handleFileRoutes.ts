import serveStatic from 'serve-static';

import { env } from '../../env';
import { cdnBucketName } from '../../webpack-custom/utils/cdnBucketName';

const CDNEnabled = env.getParamAsBoolean('YANDEX_STORAGE_ENABLED');
const compressedEnabled = env.getParamAsBoolean('GENERATE_COMPRESSED');

const compressions = [
  {
    encoding: 'br',
    extension: 'br',
  },
  {
    encoding: 'gzip',
    extension: 'gz',
  },
];

function redirectToCdn(req, res) {
  return res.redirect(`https://storage.yandexcloud.net/${cdnBucketName}${req.url}`);
}

function serveCompressed(contentType) {
  return (req, res, next) => {
    const acceptedEncodings = req.acceptsEncodings();

    const acceptedCompression = compressedEnabled
      ? compressions.find(({ encoding }) => acceptedEncodings.indexOf(encoding) !== -1)
      : null;

    if (acceptedCompression) {
      req.url = `${req.url}.${acceptedCompression.extension}`;
      res.set('Content-Encoding', acceptedCompression.encoding);
      res.set('Content-Type', contentType);
    }

    return next();
  };
}

export function handleFileRoutes(app) {
  app.get('*.js', serveCompressed('text/javascript'));
  app.get('*.css', serveCompressed('text/css'));

  app.use(serveStatic('uploads'));

  if (!CDNEnabled) {
    app.use(serveStatic('build'));

    // Send 404 for all not found files
    app.get('*', (req, res, next) =>
      req.originalUrl.indexOf('.') !== -1 ? res.sendStatus(404) : next()
    );
  } else {
    app.get('*', (req, res, next) =>
      req.originalUrl.indexOf('.') !== -1 ? redirectToCdn(req, res) : next()
    );
  }
}
