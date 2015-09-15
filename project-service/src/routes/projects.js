import express from 'express';
import R from 'ramda';
import models from '../models';
import publish from '../publish';

// for URLs
// /projects/
// /projects/:projectId
// /projects/:projectId/users

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
  },
  users: { // /projects/:projectId/assignusers
    405: {error: 'Use POST to assign or remove users from project.'}
  }
};

// verifies projectId in database and saves to req.project
// only search projects that include the user sending the request
export const validation = (req, res, next, projectId) => {
  models.Project.findOne({
    where: {id: projectId},
    include: [{
      model: models.User,
      as: 'users',
      where: {id: req.user.model.id}
    }]
  })
  .then((project) => {
    if (!project) {
      return res.status(404).json(msg.project[404]);
    }

    project.getUsers().then((users) => {
      req.project = project;
      if (users) {
        req.project.users = users;
        req.project.acl = R.pluck('auth0Id')(users);
      }
      next();
    });
  });
};

// callback triggers for route parameters
// - need router level `validation` because app level only matches `/projects`,
//   therefore never triggers `validation` callback
router.param('projectId', validation);

// Fetch/Create User's Projects
/* === /projects === */

router.get('/', (req, res, next) => {
  req.user.model.getProjects()
    .then((projects) => {
      res.status(200).json(R.pluck('dataValues')(projects));
    });
});

router.post('/', (req, res, next) => {
  req.body.emails = req.body.emails || [];
  if (!(req.body.name && Array.isArray(req.body.emails))) {
    return res.status(400).json(msg.projects[400]);
  }

  Promise.all(req.body.emails.map((email) => {
    return new Promise((resolve) => {
      models.User.findOne({where: {email: email}}).then(resolve);
    });
  }))
  .then((users) => {
    req.body.emails.filter((email, i) => {
      return !users[i];
    });

    users = R.filter(R.identity)(users); // valid users
    let acl = R.union([req.user.user_id], R.pluck('auth0Id')(users));
    let userIds = R.pluck('id')(users);

    let params = {};
    params.name = req.body.name;
    if (req.body.length) {
      params.length = req.body.length;
    }

    req.user.model.createProject(params).then((project) => {
      // create default sprint and add all valid users
      Promise.all([project.createSprint(), project.addUsers(userIds)]).then(() => {
        res.status(201).json(project.dataValues);

        // publish
        publish('project:add', acl, R.merge(project.dataValues, {
          message: `A new project ${project.name} has been added to your dashboard.`
        }));
      });
    });
  });
});

// Fetch/Modify/Delete Project
/* === /projects/:projectId === */

router.get('/:projectId', (req, res, next) => {
  models.Project.findOne({ // new query with eager loading
    where: {id: req.project.id},
    include: [
      {model: models.User, as: 'users'},
      {model: models.Sprint, as: 'sprints'},
      {model: models.Task, as: 'tasks'}
    ],
    order: [
      [
        {model: models.Task, as: 'tasks'},
        'order',
        'ASC'
      ]
    ]
  })
  .then((project) => {
    // only retain underlying data from database for response
    project.users = R.pluck('dataValues')(project.users);
    project.sprints = R.pluck('dataValues')(project.sprints);
    project.tasks = R.pluck('dataValues')(project.tasks);

    // determine the ongoing and planning phase sprints
    let currentSprint = R.find(R.propEq('status', 1))(project.sprints);
    let nextSprint = R.find(R.propEq('status', 0))(project.sprints);

    if (currentSprint) { // if there is an ongoing sprint at the moment
      currentSprint.tasks = R.filter(R.propEq('sprintId', currentSprint.id))(project.tasks);
    }
    if (nextSprint) {
      nextSprint.tasks = R.filter(R.propEq('sprintId', nextSprint.id))(project.tasks);
    }
    let backlog = R.filter(R.propEq('sprintId', null))(project.tasks);

    res.status(200).json({
      id: project.id,
      name: project.name,
      length: project.length,
      users: project.users,
      currentSprint,
      nextSprint,
      backlog
    });
  });
});

router.put('/:projectId', (req, res, next) => {
  if (!(req.body.name || req.body.length)) {
    return res.status(400).json(msg.project[400]);
  }
  req.project.update({
    name: req.body.name || req.project.getDataValue('name'),
    length: req.body.length || req.project.getDataValue('length')
  })
  .then((project) => {
    res.status(200).json(project.dataValues);

    // publish
    publish('project:change', req.project.acl, R.merge(project.dataValues, {
      initiator: req.user.model.id,
      message: `${req.user.model.username} has modified project details for ${project.name}.`
    }));
  });
});

router.delete('/:projectId', (req, res, next) => {
  req.project.destroy()
    .then(() => {
      res.sendStatus(204); // same as res.status(204).send('No Content');

      publish('project:delete', req.project.acl, {
        id: req.project.id,
        name: req.project.name,
        initiator: req.user.model.id,
        message: `The project ${req.project.name} has been deleted by ${req.user.model.username}.`
      });
    });
});

// Reorder Tasks
/* === /projects/:projectId/positions === */

router.post('/:projectId/positions', (req, res, next) => {
  if (!Array.isArray(req.body.positions)) {
    return res.status(400).json(msg.project[400]);
  }

  // fetch all backlog tasks
  req.project.getTasks({where: {sprintId: null}})
    .then((tasks) => {
      // create tasks hash
      let tasksHash = tasks.reduce((hash, task) => {
        hash[task.id] = task;
        return hash;
      }, {});

      // create positions hash -
      // - the order to be assigned to the task is the index + 1
      // - only add to hash if the id corresponds to an existing task
      let posHash = req.body.positions.reduce((hash, id, idx) => {
        if (tasksHash[id]) {
          hash[id] = idx + 1;
        }
        return hash;
      }, {});

      // both hashes should have the same number of tasks, otherwise it means
      // the `positions` array did not have all the backlog tasks
      if (Object.keys(tasksHash).length !== Object.keys(posHash).length) {
        return res.status(400).json(msg.project[400]);
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

// Add/Remove Users
/* === /projects/:projectId/assignusers === */

router.post('/:projectId/assignusers', (req, res, next) => {
  req.body.add = req.body.add || [];
  req.body.remove = req.body.remove || [];

  if (!(Array.isArray(req.body.add) && Array.isArray(req.body.remove))) {
    return res.status(400).json(msg.project[400]);
  }

  Promise.all([
    req.project.addUsers(req.body.add),
    req.project.removeUsers(req.body.remove)
  ])
  .then(() => {
    res.sendStatus(204);
  });
});


// Catch
router.all('/:projectId/assignusers', (req, res, next) => {
  res.status(405).json(msg.users[405]);
});

router.all('/:projectId', (req, res, next) => {
  res.status(405).json(msg.project[405]);
});

router.all('/', (req, res, next) => {
  res.status(405).json(msg.projects[405]);
});

export default router;
