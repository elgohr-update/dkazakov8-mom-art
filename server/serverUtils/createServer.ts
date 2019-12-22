import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

import express from 'express';

import { env } from '../../env';
import { paths } from '../../webpack-custom/utils/paths';

type ServerType = {
  app?: express.Application;
  useMiddlewares?: (middlewares: Function[]) => ServerType;
  start?: () => void;
};

export function createServer() {
  const server: ServerType = {};

  server.app = express();
  server.useMiddlewares = middlewares => {
    middlewares.forEach(fn => fn(server.app));

    return server;
  };

  server.start = function startServer() {
    const port = env.getParam('EXPRESS_PORT');

    if (env.getParamAsBoolean('HTTPS_BY_NODE')) {
      const sslOptions = {
        key: fs.readFileSync(path.resolve(paths.rootPath, 'ssl-local/cert.key')),
        cert: fs.readFileSync(path.resolve(paths.rootPath, 'ssl-local/cert.pem')),
      };

      https.createServer(sslOptions, server.app).listen(443);
    } else {
      http.createServer(server.app).listen(port);
    }

    return server;
  };

  return server;
}
