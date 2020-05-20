import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs';

import ws from 'ws';
import watch from 'node-watch';
import express from 'express';

import { env } from '../env';
import { paths } from '../paths';
import { configEntryServer } from '../webpack-custom/configs/configEntryServer';

function startReloadServer() {
  const sslOptions = {
    key: fs.readFileSync(path.resolve(paths.rootPath, 'ssl-local/cert.key')),
    cert: fs.readFileSync(path.resolve(paths.rootPath, 'ssl-local/cert.pem')),
  };

  const app = express();

  app.get(env.HOT_RELOAD_CLIENT_URL, (req, res) => {
    res.type('text/javascript');
    res.send(`
(function refresh() {
  let socketUrl = window.location.origin;
  if (!socketUrl.match(/:[0-9]+/)) {
    socketUrl = socketUrl + ':80';
  }
  socketUrl = socketUrl.replace(/(^http(s?):\\/\\/)(.*:)(.*)/,${`'ws$2://$3${env.HOT_RELOAD_PORT}`}');

  function websocketWaiter() {
    const socket = new WebSocket(socketUrl);

    socket.onmessage = function socketOnMessage(msg) {
      if (msg.data === 'reload') {
        socket.close();
        window.location.reload();
      }
    };

    socket.onclose = function socketOnClose() {
      setTimeout(function reconnectSocketDelayed() {
        websocketWaiter();
      }, 1000);
    };
  }

  window.addEventListener('load', websocketWaiter);
})();
`);
  });

  const server = env.HTTPS_BY_NODE ? https.createServer(sslOptions, app) : http.createServer(app);

  // https://github.com/websockets/ws
  return new ws.Server({ server: server.listen(env.HOT_RELOAD_PORT) });
}

function startFileWatcher(wss) {
  // https://github.com/yuanchuan/node-watch
  const serverChunks = Object.keys(configEntryServer);
  const excludedFilenames = [...serverChunks];
  let watchDebounceTimeout = null;
  let changedFiles = [];

  watch(
    paths.buildPath,
    {
      // watch only files in root folder
      recursive: false,
      filter: filePath => !excludedFilenames.some(fileName => filePath.indexOf(fileName) !== -1),
    },
    function onFilesChanged(event, filePath) {
      const fileName = filePath.replace(paths.buildPath, '').replace(/[\\/]/g, '');

      changedFiles.push(fileName);

      clearTimeout(watchDebounceTimeout);

      watchDebounceTimeout = setTimeout(() => {
        // console.log(`reload triggered by\n`, changedFiles);

        changedFiles = [];

        wss.clients.forEach(client => {
          if (client.readyState === ws.OPEN) client.send('reload');
        });
      }, 50);
    }
  );
}

const wss = startReloadServer();
startFileWatcher(wss);
