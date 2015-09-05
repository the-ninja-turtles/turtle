import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import auth from './auth.js';
import publish from './publish.js';
import subscribe from './subscribe.js';
import normalize from './normalize.js';

let publicApp = express();
let privateApp = express();

publicApp.use(cors());
publicApp.use(normalize);
publicApp.use(auth);
publicApp.use(subscribe);
publicApp.use((req, res) => {
  res.status(404).json({error: 'Not found'});
});

privateApp.use(bodyParser.json());
privateApp.use(publish);
privateApp.use((req, res) => {
  res.status(404).json({error: 'Not found'});
});

export let publicApi = publicApp.listen(process.env.PORT_EXT || 8000);
export let privateApi = privateApp.listen(process.env.PORT_INT || 8001);
