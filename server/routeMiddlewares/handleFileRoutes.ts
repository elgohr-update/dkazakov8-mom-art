import serveStatic from 'serve-static';

import { env } from '../../env';

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
  return res.redirect(
    `${env.YANDEX_STORAGE_ENDPOINT}/${env.YANDEX_STORAGE_BUCKET_PREFIX}${env.YANDEX_STORAGE_BUCKET}${req.url}`
  );
}

function setContentType(contentType) {
  return (req, res, next) => {
    res.set('Content-Type', contentType);

    return next();
  };
}

function setEncoding(encoding) {
  return (req, res, next) => {
    res.set('Content-Encoding', encoding);

    return next();
  };
}

export function handleFileRoutes(app) {
  if (env.YANDEX_STORAGE_ENABLED) {
    return app.get('*', (req, res, next) =>
      req.originalUrl.indexOf('.') !== -1 ? redirectToCdn(req, res) : next()
    );
  }

  compressions.forEach(({ encoding, extension }) => {
    app.get(`*.js.${extension}`, setContentType('text/javascript'));
    app.get(`*.js.${extension}`, setEncoding(encoding));
    app.get(`*.css.${extension}`, setContentType('text/css'));
    app.get(`*.css.${extension}`, setEncoding(encoding));
  });

  app.use(serveStatic('build'));

  // Send 404 for all not found files
  app.get('*', (req, res, next) =>
    req.originalUrl.indexOf('.') !== -1 ? res.sendStatus(404) : next()
  );
}
