import express from 'express';
import R from 'ramda';
import models from '../models';

// for URLs
// /projects/:projectId/sprints
// /projects/:projectId/sprints/:sprintId
// /projects/:projectId/sprints/:sprintId/tasks

let router = express.Router();

let msg = {
  project: { // project level (/projects/:projectId/sprints)
    400: {error: 'Invalid data parameters.'},
    405: {error: 'Use GET to receive sprints and POST to create a new sprint.'}
  },
  sprint: { // sprint level (/projects/:projectId/sprints/:sprintId)
    400: {error: 'Invalid data parameters.'},
    404: {error: "Sprint doesn't exist."},
    405: {error: 'Use GET for sprint details, PUT to modify, and DELETE to delete.'}
  },
  task: { // task level (/projects/:projectId/sprints/:sprintId/tasks)
    400: {error: 'Invalid data parameters.'},
    405: {error: 'Use PUT to assign or remove tasks from the sprint.'}
  }
};

// callback triggers for route parameters
router.param('sprintId', (req, res, next, sprintId) => {
  models.Sprint.findOne({
    where: {
      id: sprintId,
      projectId: req.project.id
    }
  })
  .then((sprint) => {
    if (!sprint) {
      return res.status(404).json(msg.sprint[404]);
    }
    req.sprint = sprint;
    next();
  });
});

// Add/Remove Tasks to/from Sprint
/* === /projects/:projectId/sprints/:sprintId/tasks === */

// router.put('/:projectId/sprints/:sprintId/tasks', (req, res, next) => {
router.put('/:sprintId/tasks', (req, res, next) => {
  if (!(req.body.add || req.body.remove)) {
    return res.status(400).json(msg.task[400]);
  }

  req.body.add = req.body.add || [];
  req.body.remove = req.body.remove || [];

  Promise.all([
    // add tasks in the `add` array to spirnt
    models.Task.update({
      sprintId: req.sprint.id
    }, {
      where: { // the tasks must be part of the project
        id: {
          $in: req.body.add
        },
        projectId: req.project.id
      }
    }),
    // remove tasks in the `remove` array from sprint
    models.Task.update({
      sprintId: null
    }, {
      where: { // the tasks must be part of the project _and_ sprint
        id: {
          $in: req.body.remove
        },
        sprintId: req.sprint.id,
        projectId: req.project.id
      }
    })
  ])
  .then(() => {
    res.sendStatus(204);
  });
});

router.all('/:sprintId/tasks', (req, res, next) => {
  res.status(405).json(msg.tasks[405]);
});

// Fetch/Modify/Delete Sprint
/* === /projects/:projectId/sprints/:sprintId === */

router.get('/:sprintId', (req, res, next) => {
  models.Sprint.findOne({
    where: {
      id: req.sprint.id
    },
    include: [{
      model: models.Task,
      as: 'tasks',
      include: [{ // eager loading nested association
        model: models.User,
        as: 'user'
      }]
    }],
    order: [[ // order tasks ascending by `rank`
      {
        model: models.Task,
        as: 'tasks'
      },
      'rank',
      'ASC'
    ]]
  })
  .then((sprint) => { // route middleware already checks that this is an existing sprint
    sprint = sprint.dataValues;
    sprint.tasks = sprint.tasks.map((task) => {
      task = task.dataValues;
      task.user = task.user ? task.user.dataValues : null;
      return task;
    });

    res.status(200).json(sprint);
  });
});

router.put('/:sprintId', (req, res, next) => {
  // at least one data parameter must exist
  if (!(req.body.name || req.body.status || req.body.startDate || req.body.endDate)) {
    return res.status(400).json(msg.sprint[400]);
  }

  req.sprint.update({
    name: req.body.name || req.sprint.getDataValue('name'),
    status: req.body.status || req.sprint.getDataValue('status'),
    startDate: req.body.startDate || req.sprint.getDataValue('startDate'),
    endDate: req.body.endDate || req.sprint.getDataValue('endDate')
  })
  .then((sprint) => {
    res.status(200).json(sprint.dataValues);
  });
});

router.delete('/:sprintId', (req, res, next) => {
  req.sprint.destroy()
    .then(() => {
      res.sendStatus(204);
    });
});

router.all('/:sprintId', (req, res, next) => {
  res.status(405).json(msg.sprint[405]);
});

// Fetch/Create Project's Sprints
/* === /projects/:projectId/sprints === */

router.get('/', (req, res, next) => {
  req.project.getSprints()
    .then((sprints) => {
      res.status(200).json(R.pluck('dataValues')(sprints));
    });
});

router.post('/', (req, res, next) => {
  // all data parameters must exist
  if (!(req.body.name && req.body.status && req.body.startDate && req.body.endDate)) {
    return res.status(400).json(msg.project[400]);
  }

  req.project.createSprint({
    name: req.body.name,
    status: req.body.status,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  })
  .then((sprint) => {
    res.status(201).json(sprint.dataValues);
  });
});

router.all('/', (req, res, next) => {
  res.status(405).json(msg.project[405]);
});

export default router;
