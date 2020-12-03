import bodyParser from 'body-parser';

export function handleUrlencodedRequests(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
}
