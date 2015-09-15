import request from 'supertest-as-promised';
import test from 'blue-tape';
import sinon from 'sinon';
import R from 'ramda';
import {authorization, profile} from '../../tests/fakeauth';
import { projects as testProjects, sprints as testSprints, tasks as testTasks } from '../../tests/fixtures';
import app from '../src/app';
import router from '../src/routes/tasks';
import models from '../src/models';

const before = test;
const after = test;

let userId;
let projectId;
let sprintIds;
let taskIds;

let spy = sinon.spy();
router.__Rewire__('publish', spy);

// sync database and create fixtures
before('Before - Task Spec', (t) => {
  let currentProject;

  return models.sequelize.sync({
    force: true
  })
  .then(() => { // create test user #0
    return models.User.create({
      auth0Id: profile(0).user_id,
      email: profile(0).email,
      username: profile(0).nickname
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
      project.createSprint(testSprints[0]), // ongoing
      project.createSprint(testSprints[1]) // planning
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
  .then((tasks) => { // associate with project, user, and specify order
    taskIds = R.pluck('id')(tasks);
    return Promise.all([
      currentProject.addTasks(taskIds),
      tasks[0].update({order: 1, userId: userId}),
      tasks[1].update({order: 3}),
      tasks[2].update({order: 2})
    ]);
  });
});

test("GET /project/:projectId/tasks should respond with project's tasks", (t) => {
  return request(app)
    .get(`/projects/${projectId}/tasks`)
    .set('Authorization', authorization(0))
    .expect(200)
    .then((res) => {
      let tasks = res.body;
      t.pass('200 OK');

      t.assert(tasks.current, 'Response should have a current array');
      t.assert(tasks.next, 'Response should have next array');
      t.assert(tasks.backlog, 'Response should have backlog array');

      t.equal(tasks.current.length, 1, 'Current sprint should have one task');
      t.equal(tasks.next.length, 2, 'Next sprint should have two tasks');
      t.equal(tasks.backlog.length, 0, 'Backlog should be empty');

      t.assert(R.equals(R.pluck('id')(tasks.next), [3, 2]), 'The tasks should be in order');
    });
});

test('POST /project/:projectId/tasks should create a new task', (t) => {
  return request(app)
    .post(`/projects/${projectId}/tasks`)
    .set('Authorization', authorization(0))
    .send(testTasks[3])
    .expect(201)
    .then((res) => {
      let task = res.body;
      t.pass('201 CREATED');
      t.equal(task.name, testTasks[3].name, 'Task name should match');
      t.equal(task.order, 1, 'Task should haver order = 1 (first task added in backlog)');

      t.ok(spy.calledWith('task:add'), 'Event task:add should be published');
      spy.reset();
    });
});

test('POST /project/:projectId/tasks should accept optional userId and sprintId parameters', (t) => {
  let params = testTasks[3];
  params.userId = userId;
  params.sprintId = sprintIds[1];

  return request(app)
    .post(`/projects/${projectId}/tasks`)
    .set('Authorization', authorization(0))
    .send(params)
    .expect(201)
    .then((res) => {
      let task = res.body;
      t.equal(task.userId, params.userId, 'User ID should match');
      t.equal(task.sprintId, params.sprintId, 'Sprint ID should match');
      t.equal(task.order, 4, 'Task should have order = 4');
    });
});

test('POST /project/:projectId/tasks should return 404 for invalid userId or sprintId parameters', (t) => {
  let params = testTasks[3];
  params.userId = 555;
  params.sprintId = -99;

  return request(app)
    .post(`/projects/${projectId}/tasks`)
    .set('Authorization', authorization(0))
    .send(params)
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND - invalid userId or sprintId');
    });
});

test('GET /project/:projectId/tasks/:taskId should respond with 404 when taskId is invalid', (t) => {
  return request(app)
    .get(`/projects/${projectId}/tasks/1337`)
    .set('Authorization', authorization(0))
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND');
    });
});

test('GET /project/:projectId/tasks/:taskId should respond with task details', (t) => {
  return request(app)
    .get(`/projects/${projectId}/tasks/${taskIds[0]}`)
    .set('Authorization', authorization(0))
    .expect(200)
    .then((res) => {
      let task = res.body;
      t.pass('200 OK');
      t.assert(task.user, 'Task should have a user property');
      t.assert(task.sprint, 'Task should have a sprint property');
      t.equal(task.user.id, userId, 'Task user ID should match');
      t.equal(task.sprint.id, sprintIds[0], 'Task sprint ID should match');
    });
});

test('PUT /project/:projectId/tasks/:taskId should modify task', (t) => {
  let params = {
    name: 'boo',
    description: 'round and cuddly ghost',
    status: 3,
    score: 50,
    userId: 1
  };

  return request(app)
    .put(`/projects/${projectId}/tasks/${taskIds[0]}`)
    .set('Authorization', authorization(0))
    .send(params)
    .expect(200)
    .then((res) => {
      let task = res.body;
      t.pass('200 OK');

      let match = true;
      for (let key in params) {
        match = match && params[key] === task[key];
      }

      t.assert(match, 'Parameters should match');

      t.ok(spy.calledWith('task:change'), 'Event task:change should be published');
      spy.reset();
    });
});

test('PUT /project/:projectId/tasks/:taskId should respond with 404 if userId or sprintId is invalid', (t) => {
  let params = {userId: 555, sprintId: 900};
  return request(app)
    .put(`/projects/${projectId}/tasks/${taskIds[0]}`)
    .set('Authorization', authorization(0))
    .send(params)
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND - invalid userId or sprintId');
    });
});

test('DELETE /project/:projectId/tasks/:taskId should delete a task and respond with 204', (t) => {
  return request(app)
    .delete(`/projects/${projectId}/tasks/${taskIds[0]}`)
    .set('Authorization', authorization(0))
    .expect(204)
    .then((res) => {
      t.pass(204);
      return models.Task.findOne({
        where: {
          id: taskIds[0],
          projectId: projectId
        }
      });
    })
    .then((task) => {
      t.notok(task, 'Task should no longer exist');

      t.ok(spy.calledWith('task:delete'), 'Event task:delete should be published');
      spy.reset();
    });
});

after('After - Task Spec', (t) => {
  return models.sequelize.sync({
    force: true
  });
});
