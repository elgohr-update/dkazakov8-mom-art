import bodyParser from 'body-parser';

export function handleJsonRequests(app) {
  app.use(bodyParser.json());
}
