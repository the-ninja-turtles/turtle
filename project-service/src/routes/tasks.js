import express from 'express';
import R from 'ramda';
import models from '../models';

// for URLs
// /projects/:projectId/tasks
// /projects/:projectId/tasks/:taksId

let router = express.Router();

let msg = {
  project: { // project level (/projects/:projectId/tasks)
    400: {error: 'Invalid data parameters.'},
    405: {error: 'Use GET to receive tasks and POST to create a new task.'}
  },
  task: { // task level (/projects/:projectId/tasks/:taskId)
    400: {error: 'Invalid data parameters.'},
    404: (item) => {
      item = item || 'Task';
      return {error: "${item} doesn't exist."};
    },
    405: {error: 'Use GET for task details, PUT to modify, and DELETE to delete.'}
  }
};

// callback triggers for route parameters
router.param('taskId', (req, res, next, taskId) => {
  models.Task.findOne({
    where: {
      id: taskId,
      projectId: req.project.id
    }
  })
  .then((task) => {
    if (!task) {
      return res.status(404).json(msg.task[404]());
    }
    req.task = task;
    next();
  });
});

// Fetch/Create Project's Tasks
/* === /projects/:projectId/tasks === */

router.get('/', (req, res, next) => {
  Promise.all([
    req.project.getSprints(),
    models.Task.findAll({
      where: {projectId: req.project.id},
      order: [['order', 'ASC']]
    })
  ])
  .then((results) => {
    let sprints = results[0];
    let tasks = results[1];

    // determine current ongoing and next (planning) sprints
    let currentSprint = R.find(R.propEq('status', 1))(sprints);
    let nextSprint = R.find(R.propEq('status', 0))(sprints);

    let current;
    if (currentSprint) { // if there is an ongoing sprint at the moment
      current = R.pluck('dataValues')(R.filter(R.propEq('sprintId', currentSprint.id))(tasks));
    }
    let next = R.pluck('dataValues')(R.filter(R.propEq('sprintId', nextSprint.id))(tasks));
    let backlog = R.pluck('dataValues')(R.filter(R.propEq('sprintId', null))(tasks));

    res.status(200).json({current, next, backlog});
  });
});

router.post('/', (req, res, next) => {
  // check that all required parameters are provided
  // `description` allowed to be empty
  req.body.description = req.body.description || '';

  if (!(req.body.name && req.body.score)) {
    return res.status(400).json(msg.project[400]);
  }

  Promise.all([
    // check that user is valid if `userId` provided
    new Promise((resolve) => {
      if (!req.body.userId) {
        return resolve(true);
      }
      req.project.hasUser(req.body.userId).then(resolve);
    }),
    // check that sprint is valid if `sprintId` provided
    new Promise((resolve) => {
      if (!req.body.sprintId) {
        return resolve(true);
      }
      req.project.hasSprint(req.body.sprintId).then(resolve);
    }),
    models.Task.findAll({
      where: {
        projectId: req.project.id,
        sprintId: req.body.sprintId || null
      },
      order: [['order', 'DESC']]
    })
  ])
  .then((results) => {
    if (!results[0]) { // user
      return res.status(404).json(msg.task[404]('User'));
    }

    if (!results[1]) { // sprint
      return res.status(404).json(msg.task[404]('Sprint'));
    }

    let tasks = results[2];
    let max = tasks.length ? tasks[0].order : 0;

    req.project.createTask({
      name: req.body.name,
      description: req.body.description,
      score: req.body.score,
      order: max + 1, // set to highest in backlog or sprint, + 1
      projectId: req.project.id,
      userId: req.body.userId || null, // optional parameter
      sprintId: req.body.sprintId || null // optional parameter
    })
    .then((task) => {
      res.status(201).json(R.prop('dataValues')(task));
    });
  });
});

// Fetch/Modify/Delete Task
/* === /projects/:projectId/tasks/:taskId === */

router.get('/:taskId', (req, res, next) => {
  models.Task.findOne({
    where: {id: req.task.id},
    include: [
      {model: models.Sprint, as: 'sprint'},
      {model: models.User, as: 'user'}
    ]
  })
  .then((task) => { // route middleware already checks that this is an existing task
    task = task.dataValues;
    task.sprint = task.sprint ? task.sprint.dataValues : null;
    task.user = task.user ? task.user.dataValues : null;
    res.status(200).json(task);
  });
});

router.put('/:taskId', (req, res, next) => {
  // check if at least one parameter is provided
  // `description` allowed to be empty
  if (!(req.body.name || req.body.description !== undefined || req.body.status !== undefined || req.body.score || req.body.userId)) {
    return res.status(400).json(msg.task[400]);
  }

  // if `status` was provided, it needs to be between 0 and project.columns
  if (req.body.status !== undefined && (req.body.status >= req.project.columns || req.body.status < 0)) {
    return res.status(400).json(msg.task[400]);
  }

  new Promise((resolve) => { // if userId provided, it must correspond to a user
    if (!req.body.userId) {
      return resolve(true);
    }
    req.project.hasUser(req.body.userId).then(resolve);
  })
  .then((results) => {
    if (!results) { // if no user found with matching id
      return res.status(404).json(msg.task[404]('User'));
    }

    req.task.update({
      name: req.body.name || req.task.getDataValue('name'),
      description: req.body.description !== undefined ? req.body.description : req.task.getDataValue('description'),
      status: req.body.status !== undefined ? req.body.status : req.task.getDataValue('status'),
      score: req.body.score || req.task.getDataValue('score'),
      userId: req.body.userId || req.task.getDataValue('userId')
    })
    .then((task) => {
      res.status(200).json(task.dataValues);
    });
  });
});

router.delete('/:taskId', (req, res, next) => {
  req.task.destroy()
    .then(() => {
      res.sendStatus(204);
    });
});

// Catch
router.all('/:taskId', (req, res, next) => {
  res.status(405).json(msg.task[405]);
});

router.all('/', (req, res, next) => {
  res.status(405).json(msg.project[405]);
});

export default router;
