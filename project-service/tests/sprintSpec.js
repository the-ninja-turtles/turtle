import request from 'supertest-as-promised';
import test from 'blue-tape';
import R from 'ramda';
import {authorization, profile} from '../../tests/fakeauth';
import { projects as testProjects, sprints as testSprints, tasks as testTasks } from '../../tests/fixtures';
import app from '../src/app';
import models from '../src/models';

const before = test;
const after = test;

let projectId;
let sprintIds;

// sync database and create fixtures
before('Before', (t) => {
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
  .then((tasks) => {
    return currentProject.addTasks(tasks);
  });
});

test("GET /projects/:projectId/sprints should respond with project's sprints", (t) => {
  return request(app)
    .get('/projects/'+projectId+'/sprints')
    .set('Authorization', authorization(0))
    .expect(200)
    .then((res) => {
      t.pass('200 OK');
      t.assert(Array.isArray(res.body), 'Response should be an array');
      t.equal(res.body[0].name, testSprints[0].name, 'Sprint name should match');
    });
});

test('POST /projects/:projectId/sprints should create a new sprint', (t) => {
  return request(app)
    .post('/projects/'+projectId+'/sprints')
    .set('Authorization', authorization(0))
    .send(testSprints[1])
    .expect(201)
    .then((res) => {
      t.pass('201 CREATED');
      t.equal(res.body.name, testSprints[1].name, 'Sprint name should match');
    });
});

test('GET /projects/:projectId/sprints/:sprintId should respond with 404 when sprintId is invalid', (t) => {
  return request(app)
    .get('/projects/'+projectId+'/sprints/12345')
    .set('Authorization', authorization(0))
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND');
    });
});

test('GET /projects/:projectId/sprints/:sprintId should respond with sprint details', (t) => {
  return request(app)
    .get('/projects/'+projectId+'/sprints/'+sprintIds[1])
    .set('Authorization', authorization(0))
    .expect(200)
    .then((res) => {
      t.pass('200 OK');
      t.assert(Array.isArray(res.body.tasks), 'Sprint should have a tasks array');

      let ranks = R.pluck('rank')(res.body.tasks);
      let ascending = true;
      ranks.reduce((prev, curr) => {
        ascending = ascending && curr >= prev;
        return curr;
      });

      t.assert(ascending, 'Tasks should be in ascending order by rank');
    });
});

test('PUT /projects/:projectId/sprints/:sprintId should modify sprint', (t) => {
  let params = {
    name: 'the new name',
    status: 'Done'
  };

  return request(app)
    .put('/projects/'+projectId+'/sprints/'+sprintIds[0])
    .set('Authorization', authorization(0))
    .send(params)
    .expect(200)
    .then((res) => {
      let sprint = res.body;
      t.pass('200 OK');
      t.equal(sprint.name, params.name, 'Sprint name should be updated');
      t.equal(sprint.status, params.status, 'Sprint status should be updated');
      t.ok(sprint.updatedAt, 'Sprint should have updatedAt property');
    });
});

test('DELETE /projects/:projectId/sprints/:sprintId should delete a sprint without deleting tasks', (t) => {
  let numTasks;

  let params = {
    where: {id: projectId},
    include: [{
      model: models.Task,
      as: 'tasks'
    }, {
      model: models.Sprint,
      as: 'sprints'
    }]
  };

  return models.Project.findOne(params)
    .then((project) => { // track the starting number of tasks in project; request to delete sprint
      numTasks = project.tasks.length;
      return request(app)
        .delete('/projects/'+projectId+'/sprints/'+sprintIds[1])
        .set('Authorization', authorization(0))
        .expect(204);
    })
    .then((res) => { // confirm 204; request the deleted sprint and expect 404
      t.pass('204 NO CONTENT');
      return request(app)
        .get('/projects/'+projectId+'/sprints/'+sprintIds[1])
        .set('Authorization', authorization(0))
        .expect(404);
    })
    .then((res) => { // confirm 404; request project details
      t.pass('404 NOT FOUND - sprint should no longer exist');
      return models.Project.findOne(params);
    })
    .then((project) => { // confirm project tasks have not been deleted
      t.equal(project.tasks.length, numTasks, 'The number of tasks in project should remain unchanged');
    });
});

test('POST /projects/:projectId/sprints/:sprintId/assigntasks should add/remove tasks to/from sprint', (t) => {
  let taskIds = [];
  let numTasks;

  let projectParams = {
    where: {
      id: projectId
    }
  };

  let sprintParams = {
    where: {
      id: sprintIds[0]
    },
    include: [ // include tasks where the id is contained in the `taskIds` array
      {
        model: models.Task,
        as: 'tasks'
      }
    ]
  };

  return models.Project.findOne(projectParams)
    .then((project) => { // add tasks to the project (not associated with any sprint)
      return Promise.all([
        project.createTask(testTasks[3]),
        project.createTask(testTasks[4]),
        project.createTask(testTasks[5])
      ]);
    })
    .then((tasks) => { // fetch sprint
      Array.push.apply(taskIds, R.pluck('id')(tasks));
      return models.Sprint.findOne(sprintParams);
    })
    .then((sprint) => { // track starting number of tasks in sprint; send request to add tasks
      numTasks = sprint.tasks.length;
      return request(app)
        .post('/projects/'+projectId+'/sprints/'+sprintIds[0]+'/assigntasks')
        .set('Authorization', authorization(0))
        .send({add: taskIds})
        .expect(204);
    })
    .then((res) => { // confirm 204
      t.pass('204 NO CONTENT - tasks added to sprint');
      return models.Sprint.findOne(sprintParams);
    })
    .then((sprint) => { // confirm # tasks in sprint, and send request to remove tasks
      t.equal(sprint.tasks.length, numTasks + taskIds.length, 'Tasks should be assigned to sprint');
      return request(app)
        .post('/projects/'+projectId+'/sprints/'+sprintIds[0]+'/assigntasks')
        .set('Authorization', authorization(0))
        .send({remove: taskIds})
        .expect(204);
    })
    .then((res) => { // confirm 204
      t.pass('204 NO CONTENT - takss removed from sprint');
      return models.Sprint.findOne(sprintParams);
    })
    .then((sprint) => { // confirm # tasks in sprint
      t.equal(sprint.tasks.length, numTasks, 'Tasks should be removed from sprint');
    });
});

after('After', (t) => {
  return models.sequelize.sync({
    force: true
  });
});
