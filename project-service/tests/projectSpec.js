import request from 'supertest-as-promised';
import test from 'blue-tape';
import R from 'ramda';
import {authorization, profile} from '../../tests/fakeauth';
import {projects as testProjects, sprints as testSprints, tasks as testTasks} from '../../tests/fixtures';
import app from '../src/app';
import models from '../src/models';

const before = test;
const after = test;

let projectIds;

before('Before - Project Spec', (t) => {
  return models.sequelize.sync({
    force: true
  })
  .then(() => { // create test users
    return Promise.all([
      models.User.create({
        auth0Id: profile(0).user_id,
        email: profile(0).email,
        username: profile(0).nickname
      }),
      models.User.create({
        auth0Id: profile(1).user_id,
        email: profile(1).email,
        username: profile(1).nickname
      })
    ]);
  })
  .then((users) => { // create a test project for each user
    return Promise.all([
      users[0].createProject(testProjects[0]),
      users[0].createProject(testProjects[2]),
      users[1].createProject(testProjects[1])
    ]);
  })
  .then((projects) => {
    projectIds = R.pluck('id')(projects);
    return Promise.all([
      projects[0].createSprint(testSprints[1]), // create the "planning" sprint
      projects[0].createTask(testTasks[0]),
      projects[0].createTask(testTasks[1]),
      projects[0].createTask(testTasks[2]),
      projects[0].createTask(testTasks[3]),
      projects[0].createTask(testTasks[4])
    ]);
  })
  .then((results) => {
    let tasks = results.slice(1);
    return Promise.all([
      tasks[0].update({order: 1}),
      tasks[1].update({order: 5}),
      tasks[2].update({order: 3}),
      tasks[3].update({order: 4}),
      tasks[4].update({order: 2})
    ]);
  });
});

test("GET /projects should respond with user's projects", (t) => {
  return request(app)
    .get('/projects')
    .set('Authorization', authorization(0))
    .expect(200)
    .then((res) => {
      t.pass('200 OK');
      t.assert(Array.isArray(res.body), 'Response should be an array');
      t.equal(res.body[0].name, testProjects[0].name, 'Project name should match');
      t.assert(res.body[0].length, 'Project should have a length property');
      t.equal(res.body[0].columns, 4, 'Project should have a columns property = 4');
      return res;
    });
});

test('POST /projects should create a new project', (t) => {
  return request(app)
    .post('/projects')
    .set('Authorization', authorization(0))
    .send(testProjects[1])
    .expect(201)
    .then((res) => {
      let project = res.body;
      t.pass('201 CREATED');
      t.equal(project.name, testProjects[1].name, 'Project name should match');
      return models.Sprint.findOne({where: {projectId: project.id}});
    })
    .then((sprint) => {
      t.assert(sprint, 'The new project should have a sprint');
      t.equal(sprint.status, 0, 'The sprint should have status = 0');
    });
});

test('POST /projects should still create a new project if missing emails list', (t) => {
  return request(app)
    .post('/projects')
    .set('Authorization', authorization(0))
    .send({name: 'test'})
    .expect(201)
    .then((res) => {
      let project = res.body;
      t.pass('201 CREATED');
      return models.Project.findOne({where: {id: project.id}});
    })
    .then((project) => {
      return project.getUsers();
    })
    .then((users) => {
      t.equal(users.length, 1, 'Only one user should belong to project');
    });
});

test('GET /projects/:projectId should respond with 404 when projectId does not exist', (t) => {
  return request(app)
    .get('/projects/7') // some invalid projectId
    .set('Authorization', authorization(0))
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND - projectId does not exist in database');
    });
});

test('GET /projects/:projectId should respond with 404 if projectId exists but does not belong to user', (t) => {
  return request(app)
    .get(`/projects/${projectIds[2]}`) // project that belongs to another user
    .set('Authorization', authorization(0))
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND - user does not belong to this project');
    });
});

test('GET /projects/:projectId should respond with project details', (t) => {
  return request(app)
    .get(`/projects/${projectIds[0]}`)
    .set('Authorization', authorization(0))
    .expect(200)
    .then((res) => {
      let project = res.body;
      t.pass('200 OK');
      t.assert(project.users, 'Project details should include users');
      t.assert(project.nextSprint, 'Project details should include next sprint (planning)');
      t.assert(project.nextSprint.tasks, 'Next sprint should include array of tasks');
      t.assert(Array.isArray(project.backlog), 'Project details should include backlog (array)');
      t.assert(R.equals(R.pluck('id')(project.backlog), [1, 5, 3, 4, 2]), 'Backlog tasks should be in order');
    });
});

test('PUT /projects/:projectId should modify project', (t) => {
  let params = {
    name: 'supermario',
    length: 10
  };

  return request(app)
    .put(`/projects/${projectIds[0]}`)
    .set('Authorization', authorization(0))
    .send(params)
    .expect(200)
    .then((res) => {
      let project = res.body;
      t.pass('200 OK');
      t.equal(project.name, params.name, 'Project name should be updated');
      t.equal(project.length, params.length, 'Project length (sprint duration) should be updated');
      t.ok(project.updatedAt, 'Project should have updatedAt property');
    });
});

test('DELETE /projects/:projectId should delete a project and respond with 204', (t) => {
  return request(app)
    .delete(`/projects/${projectIds[1]}`)
    .set('Authorization', authorization(0))
    .expect(204)
    .then((res) => {
      t.pass('204 NO CONTENT');
      return models.Project.findOne({where: {id: projectIds[1]}});
    })
    .then((project) => {
      t.notok(project, 'Project should no longer exist in database');
    });
});

test('POST /projects/:projectId/positions should reorder the tasks in backlog', (t) => {
  let reorder = [5, 3, 1, 4, 2]; // task ids
  return request(app)
    .post(`/projects/${projectIds[0]}/positions`)
    .set('Authorization', authorization(0))
    .send({positions: reorder})
    .expect(200)
    .then((res) => {
      let backlog = res.body;
      t.pass('200 OK');
      t.assert(R.equals(R.pluck('id')(backlog), reorder), 'Should respond with reordered tasks');
      return models.Task.findAll({
        where: {
          projectId: projectIds[0],
          sprintId: null
        },
        order: [['order', 'ASC']]
      });
    })
    .then((tasks) => {
      t.assert(R.equals(R.pluck('id')(tasks), reorder), 'Tasks should be reordered when fetching project details');
    });
});

test('POST /projects/:projectId/positions should respond with 400 for invalid data params', (t) => {
  let reorder = [1, 2, 3]; // missing task ids 4 and 5
  return request(app)
    .post(`/projects/${projectIds[0]}/positions`)
    .set('Authorization', authorization(0))
    .send({positions: reorder})
    .expect(400)
    .then((res) => {
      t.pass('400 BAD REQUEST');
      return models.Task.findAll({
        where: {
          projectId: projectIds[0],
          sprintId: null
        },
        order: [['order', 'ASC']]
      });
    })
    .then((tasks) => {
      t.assert(R.equals(R.pluck('id')(tasks), [5, 3, 1, 4, 2]), 'Tasks order should not have changed');
    });
});

test('/projects/:projectId should respond with 405 when using wrong HTTP method', (t) => {
  return request(app)
    .post(`/projects/${projectIds[0]}`)
    .set('Authorization', authorization(0))
    .expect(405)
    .then(() => {
      t.pass('405 METHOD NOT ALLOWED');
    });
});

test('/projects should respond with 405 when using wrong HTTP method', (t) => {
  return request(app)
    .put('/projects')
    .set('Authorization', authorization(0))
    .expect(405)
    .then(() => {
      t.pass('405 METHOD NOT ALLOWED');
    });
});

test('Internal - POST /projects/:projectId/assignusers with add should add user(s) to project', (t) => {
  let userId;
  let params = {
    where: {id: projectIds[0]},
    include: [{model: models.User, as: 'users'}]
  };

  return models.User.findOne({where: {auth0Id: profile(1).user_id}})
    .then((user) => {
      userId = user.id;
      return request(app)
        .post(`/projects/${projectIds[0]}/assignusers`)
        .set('Authorization', authorization(0))
        .send({add: [userId]})
        .expect(204);
    })
    .then(() => {
      t.pass('204 NO CONTENT');
      return models.Project.findOne(params);
    })
    .then((project) => {
      t.equal(project.users.length, 2, 'There should be 2 users associated with the project');
      t.assert(R.find(R.propEq('id', userId))(project.users), 'Users should include the one added');
    });
});

test('Internal - POST /projects/:projectId/assignusers with remove should remove user(s) from project', (t) => {
  let userId;
  let params = {
    where: {id: projectIds[0]},
    include: [{model: models.User, as: 'users'}]
  };

  return models.User.findOne({where: {auth0Id: profile(0).user_id}})
    .then((user) => {
      userId = user.id;
      return request(app)
        .post(`/projects/${projectIds[0]}/assignusers`)
        .set('Authorization', authorization(1))
        .send({remove: [userId]})
        .expect(204);
    })
    .then(() => {
      t.pass('204 NO CONTENT');
      return models.Project.findOne(params);
    })
    .then((project) => {
      t.equal(project.users.length, 1, 'There should only be 1 user on this project');
      t.assert(!R.find(R.propEq('id', userId))(project.users), 'The removed user should not be found');
    });
});

after('After - Project Spec', (t) => {
  return models.sequelize.sync({
    force: true
  });
});
