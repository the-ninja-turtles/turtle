import request from 'supertest-as-promised';
import test from 'blue-tape';
import sinon from 'sinon';
import R from 'ramda';
import {authorization, profile} from '../../tests/fakeauth';
import {projects as testProjects, sprints as testSprints, tasks as testTasks} from '../../tests/fixtures';
import app from '../src/app';
import router from '../src/routes/sprints';
import models from '../src/models';

const before = test;
const after = test;

let projectId;
let sprintIds;
let taskIds;

let spy = sinon.spy();
router.__Rewire__('publish', spy);

// sync database and create fixtures
before('Before - Sprint Spec', (t) => {
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
  .then((tasks) => {
    taskIds = R.pluck('id')(tasks);
    return Promise.all([
      tasks[0].update({order: 1}),
      tasks[1].update({order: 1}),
      tasks[2].update({order: 2}),
      currentProject.addTasks(tasks)
    ]);
  });
});

test("GET /projects/:projectId/sprints should respond with project's sprints", (t) => {
  return request(app)
    .get(`/projects/${projectId}/sprints`)
    .set('Authorization', authorization(0))
    .expect(200)
    .then((res) => {
      let sprints = res.body;
      t.pass('200 OK');
      t.assert(sprints.currentSprint, 'Response should have the current sprint if there is one');
      t.assert(sprints.nextSprint, 'Response should have the next sprint');
      t.equal(sprints.currentSprint.name, testSprints[0].name, 'Sprint name should match');
    });
});

test('GET /projects/:projectId/sprints/:sprintId should respond with 404 when sprintId is invalid', (t) => {
  return request(app)
    .get(`/projects/${projectId}/sprints/12345`)
    .set('Authorization', authorization(0))
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND');
    });
});

test('GET /projects/:projectId/sprints/:sprintId should respond with sprint details', (t) => {
  return request(app)
    .get(`/projects/${projectId}/sprints/${sprintIds[1]}`)
    .set('Authorization', authorization(0))
    .expect(200)
    .then((res) => {
      let sprint = res.body;
      t.pass('200 OK');
      t.assert(Array.isArray(sprint.tasks), 'Sprint should have a tasks array');
    });
});

test('PUT /projects/:projectId/sprints/:sprintId should modify sprint', (t) => {
  let params = {name: 'the new name'};

  return request(app)
    .put(`/projects/${projectId}/sprints/${sprintIds[0]}`)
    .set('Authorization', authorization(0))
    .send(params)
    .expect(200)
    .then((res) => {
      let sprint = res.body;
      t.pass('200 OK');
      t.equal(sprint.name, params.name, 'Sprint name should be updated');
      t.ok(sprint.updatedAt, 'Sprint should have updatedAt property');
    });
});

test('POST /projects/:projectId/sprints/start should respond with 400 if there is already an ongoing sprint', (t) => {
  return request(app)
    .post(`/projects/${projectId}/sprints/start`)
    .set('Authorization', authorization(0))
    .expect(400)
    .then((res) => {
      t.pass('400 BAD REQUEST');
    });
});

test('POST /projects/:projectId/sprints/end should end the current ongoing sprint', (t) => {
  spy.reset();

  return request(app)
    .post(`/projects/${projectId}/sprints/end`)
    .set('Authorization', authorization(0))
    .expect(204)
    .then((res) => {
      t.pass('204 NO CONTENT');
      return Promise.all([
        models.Sprint.findOne({where: {id: sprintIds[0]}}),
        models.Task.findOne({where: {id: taskIds[0]}})
      ]);
    })
    .then((results) => {
      let sprint = results[0];
      let task = results[1];

      t.equal(sprint.status, 2, 'The prior ongoing sprint should now have status = 2 (complete)');
      t.equal(task.sprintId, null, 'Unfinished tasks should be moved to the backlog');

      t.comment('Event publication tests');
      let args = spy.args[0];
      let event = args[0];
      let acl = args[1];
      let data = args[2];
      t.equal(event, 'sprint:end', 'Event sprint:end should be published');
      t.ok(acl.length, 'ACL should include at least 1 user');
      t.ok(data.initiator, 'Payload should include initiator user id');
      t.ok(data.projectId, 'Payload should include project id');
      t.ok(data.message, 'Payload should have a message');
    });
});

test('POST /projects/:projectId/sprints/end should respond with 400 if there is no ongoing sprint', (t) => {
  return request(app)
    .post(`/projects/${projectId}/sprints/end`)
    .set('Authorization', authorization(0))
    .expect(400)
    .then((res) => {
      t.pass('400 BAD REQUEST');
    });
});

test('POST /projects/:projectId/sprints/start should start the next sprint', (t) => {
  spy.reset();

  return request(app)
    .post(`/projects/${projectId}/sprints/start`)
    .set('Authorization', authorization(0))
    .expect(204)
    .then((res) => {
      t.pass('204 NO CONTENT');
      return models.Sprint.findOne({where: {id: sprintIds[1]}});
    })
    .then((sprint) => {
      t.equal(sprint.status, 1, 'The prior planning sprint should now have status = 1 (ongoing)');

      t.comment('Event publication tests');
      let args = spy.args[0];
      let event = args[0];
      let acl = args[1];
      let data = args[2];
      t.equal(event, 'sprint:start', 'Event sprint:start should be published');
      t.ok(acl.length, 'ACL should include at least 1 user');
      t.ok(data.initiator, 'Payload should include initiator user id');
      t.ok(data.projectId, 'Payload should include project id');
      t.ok(data.message, 'Payload should have a message');
    });
});

test('POST /projects/:projectId/sprints/:sprintId/positions should reorder tasks', (t) => {
  spy.reset();
  let order;

  // find all tasks in this sprint, send a request to reverse the order
  return models.Task.findAll({where: {sprintId: sprintIds[1]}})
    .then((tasks) => {
      order = R.pluck('id')(tasks);
      order.push(order.shift());
      return request(app)
        .post(`/projects/${projectId}/sprints/${sprintIds[1]}/positions`)
        .set('Authorization', authorization(0))
        .send({
          id: order[order.length - 1],
          index: order.length - 1
        })
        .expect(200);
    })
    .then((res) => {
      let tasks = res.body;
      t.pass('200 OK');
      t.assert(R.equals(R.pluck('id')(tasks), order), 'Tasks should be reordered');

      t.comment('Event publication tests');
      let args = spy.args[0];
      let event = args[0];
      let acl = args[1];
      let data = args[2];
      t.equal(event, 'task:reorder', 'Event task:reorder should be published');
      t.ok(acl.length, 'ACL should have at least 1 user');
      t.equal(data.id, order[order.length - 1], 'Payload should have task id');
      t.equal(data.oldIndex, 0, 'Payload should have old index');
      t.equal(data.newIndex, order.length - 1, 'Payload should have new index');
      t.ok(data.sprintId, 'Payload should have sprint id');
      t.ok(data.projectId, 'Payload should have project id');
      t.ok(data.initiator, 'Payload should have a initiator user id');
      t.ok(data.message, 'Payload should have a message');
    });
});

test('POST /projects/:projectId/sprints/:sprintId/assigntasks should add tasks to sprint', (t) => {
  let testIds;
  let numTasks;

  let projectParams = {where: {id: projectId}};
  let sprintParams = {where: {id: sprintIds[0]}, include: [{model: models.Task, as: 'tasks'}]};

  return Promise.all([
    models.Project.findOne(projectParams),
    models.Sprint.findOne(sprintParams)
  ])
  .then((results) => {
    let project = results[0];
    let sprint = results[1];
    numTasks = sprint.tasks.length; // track initial number of tasks

    return Promise.all([ // create additional tasks in backlog
      project.createTask(testTasks[3]),
      project.createTask(testTasks[4])
    ]);
  })
  // request to add backlog tasks to sprint
  .then((tasks) => {
    spy.reset();
    testIds = R.pluck('id')(tasks);
    return request(app)
      .post(`/projects/${projectId}/sprints/${sprintIds[0]}/assigntasks`)
      .set('Authorization', authorization(0))
      .send({add: R.concat(testIds, [taskIds[2]])}) // include a task that belongs to another sprint
      .expect(204);
  })
  .then((res) => {
    t.pass('204 NO CONTENT - tasks added to sprint');

    t.comment('Event publication tests');
    let args = spy.args[0];
    let event = args[0];
    let acl = args[1];
    let data = args[2];
    t.equal(event, 'sprint:assign', 'Event sprint:assign should be published');
    t.ok(acl.length, 'ACL should have at least 1 user');
    t.ok(Array.isArray(data.add), 'Payload should have tasks added array');
    t.ok(Array.isArray(data.remove), 'Payload should have tasks removed array');
    t.ok(data.sprintId, 'Payload should have sprint id');
    t.ok(data.projectId, 'Payload should have project id');
    t.ok(data.initiator, 'Payload should have a initiator user id');
    t.ok(data.message, 'Payload should have a message');

    return models.Sprint.findOne(sprintParams);
  })
  .then((sprint) => {
    t.equal(sprint.tasks.length, numTasks + testIds.length, 'Tasks should be assigned to sprint');
    t.assert(!R.find(R.propEq('id', taskIds[2]))(sprint.tasks), 'Invalid task should be ignored');
    t.assert(R.equals(R.takeLast(testIds.length, R.pluck('id')(sprint.tasks)), testIds), 'Tasks should be in order');

    // request removal of tasks from sprint
    return request(app)
      .post(`/projects/${projectId}/sprints/${sprintIds[0]}/assigntasks`)
      .set('Authorization', authorization(0))
      .send({remove: R.concat(R.reverse(testIds), [taskIds[2]])}) // include a task that belongs to another sprint
      .expect(204);
  })
  .then((res) => {
    t.pass('204 NO CONTENT - tasks removed from sprint');
    return Promise.all([
      models.Sprint.findOne(sprintParams),
      models.Task.findOne({where: {id: taskIds[2]}}),
      models.Task.findAll({
        where: {projectId: projectId, sprintId: null},
        order: [['order', 'ASC']]
      })
    ]);
  })
  .then((results) => {
    let sprint = results[0];
    let invalidTask = results[1];
    let backlogTasks = results[2];

    t.equal(sprint.tasks.length, numTasks, 'Tasks should be removed from sprint');
    t.equal(invalidTask.sprintId, sprintIds[1], 'Invalid task should still be associated with its sprint');
    t.assert(R.equals(R.takeLast(testIds.length, R.pluck('id')(backlogTasks)), R.reverse(testIds)), 'Tasks moved to backlog should be in order');
  });
});

after('After - Sprint Spec', (t) => {
  return models.sequelize.sync({
    force: true
  });
});
