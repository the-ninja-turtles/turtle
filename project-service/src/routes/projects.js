import express from 'express';
import R from 'ramda';
import models from '../models';
import publish from '../publish.js';

// for URLs
// /projects/
// /projects/:projectId

let router = express.Router();

let msg = {
  projects: { // projects level (/projects)
    400: {error: 'Invalid data parameters.'},
    405: {error: 'Use GET to receive projects and POST to create a new project.'}
  },
  project: { // project level (/projects/:projectId)
    400: {error: 'Invalid data parameters.'},
    404: {error: "Project doesn't exist."},
    405: {error: 'Use GET for project details, PUT to modify, and DELETE to delete.'}
  }
};

// verifies projectId in database and saves to req.project
// the project must also include user that is sending the request
export const validation = (req, res, next, projectId) => {
  models.Project.findOne({
    where: {
      id: projectId
    },
    include: [{
      model: models.User,
      as: 'users',
      where: {
        id: req.user.model.id
      }
    }]
  })
  .then((project) => {
    if (!project) {
      return res.status(404).json(msg.project[404]);
    }
    req.project = project;
    next();
  });
};

// callback triggers for route parameters
// - need router level `validation` because app level only matches `/projects`,
//   therefore never triggers `validation` callback
router.param('projectId', validation);

// Fetch/Modify/Delete Project
/* === /projects/:projectId === */

router.get('/:projectId', (req, res, next) => {
  models.Project.findOne({ // new query with eager loading
    where: {id: req.project.id},
    include: [
      {
        model: models.User,
        as: 'users'
      }, {
        model: models.Sprint,
        as: 'sprints'
      }, {
        model: models.Task,
        as: 'tasks'
      }
    ],
    order: [ // sort sprints ascending by start date, tasks ascending by `rank`
      [
        {
          model: models.Sprint,
          as: 'sprints'
        },
        'startDate',
        'ASC'
      ], [
        {
          model: models.Task,
          as: 'tasks'
        },
        'rank',
        'ASC'
      ]
    ]
  })
  .then((project) => {
    project = project.dataValues;
    project.users = R.pluck('dataValues')(project.users);
    project.sprints = R.pluck('dataValues')(project.sprints);
    project.tasks = R.pluck('dataValues')(project.tasks);
    res.status(200).json(project);
  });
});

router.put('/:projectId', (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json(msg.project[400]);
  }

  req.project.update({
    name: req.body.name
  })
  .then((project) => {
    res.status(200).json(project.dataValues);
  });
});

router.delete('/:projectId', (req, res, next) => {
  req.project.destroy()
    .then(() => {
      res.sendStatus(204); // same as res.status(204).send('No Content');
    });
});

router.all('/:projectId', (req, res, next) => {
  res.status(405).json(msg.project[405]);
});

// Fetch/Create User's Projects
/* === /projects === */

router.get('/', (req, res, next) => {
  req.user.model.getProjects()
    .then((projects) => {
      res.status(200).json(R.pluck('dataValues')(projects));
    });
});

router.post('/', (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json(msg.projects[400]);
  }

  req.user.model.createProject({
    name: req.body.name
  })
  .then((project) => {
    res.status(201).json(project.dataValues);
    publish('project:add', ['*'], project.dataValues);
  });
});

router.all('/', (req, res, next) => {
  res.status(405).json(msg.projects[405]);
});

export default router;
