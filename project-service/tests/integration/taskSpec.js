import request from 'supertest-as-promised';
import test from 'blue-tape';
import R from 'ramda';
import authorization, { profiles, projects as testProjects, sprints as testSprints, tasks as testTasks } from '../fixtures';
import app from '../../src/app';
import models from '../../src/models';

const before = test;
const after = test;

let userId;
let projectId;
let sprintIds;
let taskIds;

// sync database and create fixtures
before('Before', (t) => {
  let currentProject;

  return models.sequelize.sync({
    force: true
  })
  .then(() => { // create test user #0
    return models.User.create({
      auth0Id: profiles[0].user_id,
      email: profiles[0].email,
      username: profiles[0].nickname
    });
  })
  .then((user) => { // create a sample project associated with user #0
    userId = user.id;
    return user.createProject(testProjects[0]);
  })
  .then((project) => { // store the project id and create sample sprints
    currentProject = project;
    projectId = project.id;
    return Promise.all([
      project.createSprint(testSprints[0]),
      project.createSprint(testSprints[1])
    ]);
  })
  .then((sprints) => { // store sprint ids add sample tasks
    sprintIds = R.pluck('id')(sprints);
    return Promise.all([
      sprints[0].createTask(testTasks[0]),
      sprints[1].createTask(testTasks[1]),
      sprints[1].createTask(testTasks[2])
    ]);
  })
  .then((tasks) => { // associate the tasks with the current project
    taskIds = R.pluck('id')(tasks);
    tasks[0].userId = userId;
    return Promise.all([
      currentProject.addTasks(taskIds),
      tasks[0].save()
    ]);
  });
});

test("GET /project/:projectId/tasks should respond with project's tasks", (t) => {
  return request(app)
    .get('/projects/'+projectId+'/tasks')
    .set('Authorization', authorization[0])
    .expect(200)
    .then((res) => {
      t.pass('200 OK');
      t.assert(Array.isArray(res.body), 'Response should be an array');

      let ascending = true;
      res.body.reduce((prev, curr) => {
        ascending = ascending && curr >= prev;
        return curr;
      });

      t.assert(ascending, 'Tasks should be in ascending order by rank');
    });
});

test('POST /project/:projectId/tasks should create a new task', (t) => {
  return request(app)
    .post('/projects/'+projectId+'/tasks')
    .set('Authorization', authorization[0])
    .send(testTasks[3])
    .expect(201)
    .then((res) => {
      t.pass('201 CREATED');
      t.equal(res.body.name, testTasks[3].name, 'Task name should match');
    });
});

test('POST /project/:projectId/tasks should accept optional userId and sprintId parameters', (t) => {
  let params = testTasks[3];
  params.userId = userId;
  params.sprintId = sprintIds[1];

  return request(app)
    .post('/projects/'+projectId+'/tasks')
    .set('Authorization', authorization[0])
    .send(params)
    .expect(201)
    .then((res) => {
      t.equal(res.body.userId, params.userId, 'User ID should match');
      t.equal(res.body.sprintId, params.sprintId, 'Sprint ID should match');
    });
});

test('POST /project/:projectId/tasks should return 404 for invalid userId or sprintId parameters', (t) => {
  let params = testTasks[3];
  params.userId = 555;
  params.sprintId = -99;

  return request(app)
    .post('/projects/'+projectId+'/tasks')
    .set('Authorization', authorization[0])
    .send(params)
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND - invalid userId or sprintId');
    });
});

test('GET /project/:projectId/tasks/:taskId should respond with 404 when taskId is invalid', (t) => {
  return request(app)
    .get('/projects/'+projectId+'/tasks/1337')
    .set('Authorization', authorization[0])
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND');
    });
});

test('GET /project/:projectId/tasks/:taskId should respond with task details', (t) => {
  return request(app)
    .get('/projects/'+projectId+'/tasks/'+taskIds[0])
    .set('Authorization', authorization[0])
    .expect(200)
    .then((res) => {
      t.pass('200 OK');
      t.assert(res.body.user, 'Task should have a user property');
      t.assert(res.body.sprint, 'Task should have a sprint property');
      t.equal(res.body.user.id, userId, 'Task user ID should match');
      t.equal(res.body.sprint.id, sprintIds[0], 'Task sprint ID should match');
    });
});

test('PUT /project/:projectId/tasks/:taskId should modify task', (t) => {
  let params = {
    name: 'boo',
    description: 'round and cuddly ghost',
    status: 'Unbreakable',
    score: 50,
    rank: 0,
    userId: 1,
    sprintId: 1
  };

  return request(app)
    .put('/projects/'+projectId+'/tasks/'+taskIds[0])
    .set('Authorization', authorization[0])
    .send(params)
    .expect(200)
    .then((res) => {
      t.pass('200 OK');

      let match = true;
      for (let key in params) {
        if (params[key] !== res.body[key]) {
          match = false;
        }
      }
      t.assert(match, 'Parameters should match');
    });
});

test('PUT /project/:projectId/tasks/:taskId should respond with 404 if userId or sprintId is invalid', (t) => {
  let params = {
    userId: 555,
    sprintId: 900
  };

  return request(app)
    .put('/projects/'+projectId+'/tasks/'+taskIds[0])
    .set('Authorization', authorization[0])
    .send(params)
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND - invalid userId or sprintId');
    });
});

test('DELETE /project/:projectId/tasks/:taskId should delete a task and respond with 204', (t) => {
  return request(app)
    .delete('/projects/'+projectId+'/tasks/'+taskIds[0])
    .set('Authorization', authorization[0])
    .expect(204)
    .then((res) => {
      t.pass(204);
      return request(app)
        .get('/projects/'+projectId+'/tasks/'+taskIds[0])
        .set('Authorization', authorization[0])
        .expect(404);
    })
    .then((res) => {
      t.pass('404 NOT FOUND - task should no longer exist');
    });
});

after('After', (t) => {
  return models.sequelize.sync({
    force: true
  });
});
