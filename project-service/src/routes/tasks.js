import express from 'express';
import R from 'ramda';
import models from '../models';
import publish from '../publish.js';

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

let isValidScore = (score) => {
  return typeof score === 'number' && score >= 0;
};

let isValidRank = (rank) => {
  return typeof rank === 'number' && rank >= 0;
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

// Fetch/Modify/Delete Task
/* === /projects/:projectId/tasks/:taskId === */

router.get('/:taskId', (req, res, next) => {
  models.Task.findOne({
    where: {
      id: req.task.id
    },
    include: [
      {
        model: models.Sprint,
        as: 'sprint'
      }, {
        model: models.User,
        as: 'user'
      }
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
  // `description` allowed to be empty, `score` and `rank` allowed to be 0
  if (!(req.body.name || req.body.description !== undefined || req.body.status || req.body.score !== undefined || req.body.rank !== undefined || req.body.userId || req.body.sprintId)) {
    return res.status(400).json(msg.task[400]);
  }

  // check that score and rank are valid if provided
  if ((req.body.score !== undefined && !isValidScore(req.body.score)) ||
      (req.body.rank !== undefined && !isValidRank(req.body.rank))) {
    return res.status(400).json(msg.task[400]);
  }

  Promise.all([
    new Promise((resolve) => { // check if user is valid
      if (!req.body.userId) { // if userId wasn't provided, no need to check
        return resolve(true);
      }
      req.project.hasUser(req.body.userId).then(resolve);
    }),
    new Promise((resolve) => { // check if sprint is valid
      if (!req.body.sprintId) { // if sprintId wasn't provided, no need to check
        return resolve(true);
      }
      req.project.hasSprint(req.body.sprintId).then(resolve);
    })
  ])
  .then((results) => {
    if (!results[0]) { // user
      return res.status(404).json(msg.task[404]('User'));
    }

    if (!results[1]) { // sprint
      return res.status(404).json(msg.task[404]('Sprint'));
    }

    req.task.update({
      name: req.body.name || req.task.getDataValue('name'),
      description: req.body.description !== undefined ? req.body.description : req.task.getDataValue('description'),
      status: req.body.status || req.task.getDataValue('status'),
      score: req.body.score !== undefined ? req.body.score : req.task.getDataValue('score'),
      rank: req.body.rank !== undefined ? req.body.rank : req.task.getDataValue('rank'),
      userId: req.body.userId || req.task.getDataValue('userId'),
      sprintId: req.body.sprintId || req.task.getDataValue('sprintId')
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

router.all('/:taskId', (req, res, next) => {
  res.status(405).json(msg.task[405]);
});

// Fetch/Create Project's Tasks
/* === /projects/:projectId/tasks === */

router.get('/', (req, res, next) => {
  req.project.getTasks()
    .then((tasks) => {
      res.status(200).json(R.pluck('dataValues')(tasks));
    });
});

router.post('/', (req, res, next) => {
  // check that all required parameters are provided
  // `description` allowed to be empty, `score` and `rank` allowed to be 0
  if (!(req.body.name && req.body.description !== undefined && req.body.status && req.body.score !== undefined && req.body.rank !== undefined)) {
    return res.status(400).json(msg.project[400]);
  }

  // check that score and rank are valid
  if (!isValidScore(req.body.score) || !isValidRank(req.body.rank)) {
    return res.status(400).json(msg.task[400]);
  }

  Promise.all([
    new Promise((resolve) => { // check if user is valid
      if (!req.body.userId) { // if userId wasn't provided, no need to check
        return resolve(true);
      }
      req.project.hasUser(req.body.userId).then(resolve);
    }),
    new Promise((resolve) => { // check if sprint is valid
      if (!req.body.sprintId) { // if sprintId wasn't provided, no need to check
        return resolve(true);
      }
      req.project.hasSprint(req.body.sprintId).then(resolve);
    })
  ])
  .then((results) => {
    if (!results[0]) { // user
      return res.status(404).json(msg.task[404]('User'));
    }

    if (!results[1]) { // sprint
      return res.status(404).json(msg.task[404]('Sprint'));
    }

    req.project.createTask({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      score: req.body.score,
      rank: req.body.rank,
      projectId: req.project.id,
      userId: req.body.userId || null, // optional parameter
      sprintId: req.body.sprintId || null // optional parameter
    })
    .then((task) => {
      let data = R.prop('dataValues')(task);
      res.status(201).json(data);
      publish('task:add', ['*'], data);
    });
  });
});

router.all('/', (req, res, next) => {
  res.status(405).json(msg.project[405]);
});

export default router;
