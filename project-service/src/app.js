import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import auth from './routes/auth';
import users from './routes/users';
import projects, { validation } from './routes/projects';
import sprints from './routes/sprints';
import tasks from './routes/tasks';

let app = express();

// middleware for http request logging
app.use(morgan('dev'));
app.use(cors());

// middlewares will parse incoming request bodies and populate req.body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// routes
app.use(auth);
app.use(users); // maintains user table using Auth0 JSON Web Token
app.param('projectId', validation); // stores project in req.project if valid
app.use('/projects', projects);
app.use('/projects/:projectId/sprints', sprints);
app.use('/projects/:projectId/tasks', tasks);

// catch 404
app.use((req, res, next) => {
  res.sendStatus(404);
});

export default app;
