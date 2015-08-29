import http from 'http';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import models from './models';

import sprints from './routes/sprints';
import tasks from './routes/tasks';

let app = express();

// app is a function handler being supplied to http server
let server = http.Server(app);

// middleware for http request logging
app.use(morgan('dev'));

// middlewares will parse incoming request bodies and populate req.body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// routes
app.use('/sprints', sprints);
app.use('/tasks', tasks);

// catch 404
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// create tables and listen
let port = process.env.PORT || 3000;
models.sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log('Listening on port', port);
  });
});
