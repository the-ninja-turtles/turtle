import express from 'express';
import bodyParser from 'body-parser';
import auth from './auth.js';
import feed from './feed.js';
import publish from './publish.js';
import subscribe from './subscribe.js';

let publicApp = express();
let privateApp = express();

publicApp.use(auth(process.env.AUTH0_SECRET || 'secret', process.env.AUTH0_AUDIENCE || 'audience'));
publicApp.use(feed);
publicApp.use(subscribe);
publicApp.use((req, res) => {
  res.status(404).send();
});

privateApp.use(bodyParser.json());
privateApp.use(publish);
privateApp.use((req, res) => {
  res.status(404).send();
});

export let publicApi = publicApp.listen(process.env.PORT_EXT || 8000);
export let privateApi = privateApp.listen(process.env.PORT_INT || 8001);
