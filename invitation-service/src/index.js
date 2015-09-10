import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import auth from './auth.js';

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(auth);
app.use((req, res) => {
  res.status(404).json({error: 'Not found'});
});

export let publicApi = app.listen(process.env.PORT || 8000);
