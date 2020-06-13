import serveStatic from 'serve-static';

import { compressions } from 'const';

import { env } from '../../env';

function redirectToCdn(req, res, next) {
  return req.originalUrl.includes('.')
    ? res.redirect(`${env.CDN_ENDPOINT}/${env.CDN_BUCKET_PREFIX}${env.CDN_BUCKET}${req.url}`)
    : next();
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
  if (env.CDN_ENABLED) return app.get('*', redirectToCdn);

  compressions.forEach(({ encoding, extension }) => {
    app.get(`*.js.${extension}`, setContentType('application/javascript'));
    app.get(`*.js.${extension}`, setEncoding(encoding));

    app.get(`*.css.${extension}`, setContentType('text/css'));
    app.get(`*.css.${extension}`, setEncoding(encoding));
  });

  app.use(serveStatic('build'));

  // Send 404 for all not found files
  app.get('*', (req, res, next) => (req.originalUrl.includes('.') ? res.sendStatus(404) : next()));
}
