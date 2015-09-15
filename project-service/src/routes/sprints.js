import express from 'express';
import R from 'ramda';
import models from '../models';
import publish from '../publish';

// for URLs
// /projects/:projectId/sprints/start
// /projects/:projectId/sprints/end

// /projects/:projectId/sprints
// /projects/:projectId/sprints/:sprintId

// /projects/:projectId/sprints/:sprintId/positions
// /projects/:projectId/sprints/:sprintId/assigntasks

let router = express.Router();

let msg = {
  project: { // project level (/projects/:projectId/sprints)
    400: {error: 'Invalid data parameters.'},
    405: {error: 'Use GET to receive sprints.'}
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

// Fetch Project's Sprints
/* === /projects/:projectId/sprints === */

router.get('/', (req, res, next) => {
  req.project.getSprints()
    .then((sprints) => {
      let currentSprint = R.find(R.propEq('status', 1))(sprints);
      let nextSprint = R.find(R.propEq('status', 0))(sprints);

      res.status(200).json({
        currentSprint, // undefined if no ongoing sprint
        nextSprint
      });
    });
});

// Start/End Sprints
/* === /projects/:projectId/sprints/start === */
/* === /projects/:projectId/sprints/end === */

router.post('/start', (req, res, next) => {
  models.Sprint.findAll({
    where: {
      $or: [{status: 0}, {status: 1}],
      projectId: req.project.id
    }
  })
  .then((sprints) => {
    let currentSprint = R.find(R.propEq('status', 1))(sprints);
    let nextSprint = R.find(R.propEq('status', 0))(sprints);

    if (currentSprint) {
      return res.status(400).json({error: 'There is already an ongoing sprint.'});
    }

    Promise.all([
      nextSprint.update({
        status: 1,
        startDate: new Date()
      }),
      req.project.createSprint() // create a new sprint in planning
    ])
    .then(() => {
      res.sendStatus(204);

      // publish
      publish('sprint:start', req.project.acl, {
        projectId: req.project.id,
        initiator: req.user.model.id,
        message: `A new sprint has been started for project ${req.project.name}.`
      });
    });
  });
});

router.post('/end', (req, res, next) => {
  models.Sprint.findOne({
    where: {
      status: 1,
      projectId: req.project.id
    }
  })
  .then((sprint) => {
    if (!sprint) {
      return res.status(400).json({error: 'There is no ongoing sprint.'});
    }

    Promise.all([
      // find all unfinished tasks in sprint
      models.Task.findAll({
        where: {
          projectId: req.project.id,
          sprintId: sprint.id,
          status: {$lt: req.project.columns - 1}
        },
        order: [['order', 'ASC']]
      }),
      // find all backlog tasks
      models.Task.findAll({
        where: {
          projectId: req.project.id,
          sprintId: null
        },
        order: [['order', 'ASC']]
      }),
      // update sprint status
      sprint.update({status: 2, endDate: new Date()})
    ])
    .then((results) => {
      // reorder tasks
      // - all sprint tasks have lower `order` (higher priority)
      // - sprint tasks are ordered by `status`, then by relative `order`
      let unfinishedTasks = results[0].sort((a, b) => {
        return b.status - a.status || a.order - b.order;
      });
      let backlogTasks = results[1];

      let updates = [];
      let combinedTasks = R.concat(unfinishedTasks, backlogTasks);
      combinedTasks.forEach((task, index) => {
        updates.push(new Promise((resolve) => {
          task.update({sprintId: null, order: index + 1}).then(resolve);
        }));
      });
      return Promise.all(updates);
    })
    .then(() => {
      res.sendStatus(204);

      // publish
      publish('sprint:end', req.project.acl, {
        projectId: req.project.id,
        initiator: req.user.model.id,
        message: `The current sprint for project ${req.project.name} has ended.`
      });
    });
  });
});

// Fetch/Modify/Delete Sprint
/* === /projects/:projectId/sprints/:sprintId === */

router.get('/:sprintId', (req, res, next) => {
  models.Sprint.findOne({
    where: {id: req.sprint.id},
    include: [{
      model: models.Task,
      as: 'tasks',
      include: [{ // eager loading nested association
        model: models.User,
        as: 'user'
      }]
    }],
    order: [
      [
        {model: models.Task, as: 'tasks'},
        'order',
        'ASC'
      ]
    ]
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
  if (!req.body.name) {
    return res.status(400).json(msg.sprint[400]);
  }

  req.sprint.update({name: req.body.name})
    .then((sprint) => {
      res.status(200).json(sprint.dataValues);
    });
});

// Reorder Tasks
/* === /projects/:projectId/sprints/:sprintId/positions === */

router.post('/:sprintId/positions', (req, res, next) => {
  if (!Array.isArray(req.body.positions)) {
    return res.status(400).json(msg.sprint[400]);
  }

  // fetch all sprint tasks
  req.sprint.getTasks()
    .then((tasks) => {

      // generate tasks hash
      let tasksHash = tasks.reduce((hash, task) => {
        hash[task.id] = task;
        return hash;
      }, {});

      // generate positions hash
      //   - the order to be assigned to the task is the index + 1
      //   - only add to hash if the id corresponds to an existing task
      let posHash = req.body.positions.reduce((hash, id, idx) => {
        if (tasksHash[id]) {
          hash[id] = idx + 1;
        }
        return hash;
      }, {});

      // both hashes should have the same number of tasks, otherwise it means
      // the `positions` array did not have all the sprint's tasks
      if (Object.keys(tasksHash).length !== Object.keys(posHash).length) {
        return res.status(400).json(msg.sprint[400]);
      }

      // update each task's `order` and send success response
      Promise.all(req.body.positions.map((id) => {
        return tasksHash[id].update({order: posHash[id]});
      }))
      .then((tasks) => {
        let data = R.pluck('dataValues')(tasks).sort((a, b) => {
          return a.order - b.order;
        });
        res.status(200).json(data);
      });
    });
});

// Add/Remove Tasks to/from Sprint
/* === /projects/:projectId/sprints/:sprintId/assigntasks === */

router.post('/:sprintId/assigntasks', (req, res, next) => {
  req.body.add = req.body.add || [];
  req.body.remove = req.body.remove || [];

  if (!(Array.isArray(req.body.add) && Array.isArray(req.body.remove))) {
    return res.status(400).json(msg.task[400]);
  }

  Promise.all([
    models.Task.findAll({ // backlog
      where: {sprintId: null, projectId: req.project.id},
      order: [['order', 'DESC']]
    }),
    models.Task.findAll({ // sprint
      where: {sprintId: req.sprint.id, projectId: req.project.id},
      order: [['order', 'DESC']]
    })
  ])
  .then((results) => {
    let generateHash = (hash, task) => {
      hash[task.id] = task;
      return hash;
    };
    let backlogTasks = results[0].reduce(generateHash, {});
    let sprintTasks = results[1].reduce(generateHash, {});

    let backlogMax = backlogTasks[0] ? backlogTasks[0].order : 0;
    let sprintMax = sprintTasks[0] ? sprintTasks[0].order : 0;

    let updates = [];

    // move each task in `add` from backlog to the sprint
    // assign `order` to be the greatest order in sprint + 1
    req.body.add.forEach((id) => {
      if (backlogTasks[id]) {
        updates.push(new Promise((resolve) => {
          backlogTasks[id].update({sprintId: req.sprint.id, order: ++sprintMax}).then(resolve);
        }));
      }
    });

    // move each task in `remove` from sprint to the backlog
    // assign `order` to be the greatest order in backlog + 1
    req.body.remove.forEach((id) => {
      // only move taks out of sprint if the task is not "done"
      if (sprintTasks[id] && sprintTasks[id].status < req.project.columns - 1) {
        updates.push(new Promise((resolve) => {
          sprintTasks[id].update({sprintId: null, order: ++backlogMax}).then(resolve);
        }));
      }
    });

    return Promise.all(updates);
  })
  .then((tasks) => {
    res.sendStatus(204);
  });
});

// Catch
router.all('/:sprintId/tasks', (req, res, next) => {
  res.status(405).json(msg.tasks[405]);
});

router.all('/:sprintId', (req, res, next) => {
  res.status(405).json(msg.sprint[405]);
});

router.all('/', (req, res, next) => {
  res.status(405).json(msg.project[405]);
});

export default router;
