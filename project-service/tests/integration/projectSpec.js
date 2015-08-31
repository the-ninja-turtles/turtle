import request from 'supertest-as-promised';
import test from 'blue-tape';
import R from 'ramda';
import authorization, { profiles, projects as testProjects } from '../fixtures';
import app from '../../src/app';
import models from '../../src/models';

const before = test;
const after = test;

let projectIds;

before('Before', (t) => {
  return models.sequelize.sync({
    force: true
  })
  .then(() => { // create test users
    return Promise.all([
      models.User.create({
        auth0Id: profiles[0].user_id,
        email: profiles[0].email,
        username: profiles[0].nickname
      }),
      models.User.create({
        auth0Id: profiles[1].user_id,
        email: profiles[1].email,
        username: profiles[1].nickname
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
  });
});

test("GET /projects should respond with user's projects", (t) => {
  return request(app)
    .get('/projects')
    .set('Authorization', authorization[0])
    .expect(200)
    .then((res) => {
      t.pass('200 OK');
      t.assert(Array.isArray(res.body), 'Response should be an array');
      t.equal(res.body[0].name, testProjects[0].name, 'Project name should match');
      return res;
    });
});

test('POST /projects should create a new project', (t) => {
  return request(app)
    .post('/projects')
    .set('Authorization', authorization[0])
    .send(testProjects[1])
    .expect(201)
    .then((res) => {
      t.pass('201 CREATED');
      t.equal(res.body.name, testProjects[1].name, 'Project name should match');
    });
});

test('GET /projects/:projectId should respond with 404 when projectId does not exist', (t) => {
  return request(app)
    .get('/projects/5') // some invalid projectId
    .set('Authorization', authorization[0])
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND - projectId does not exist in database');
    });
});

test('GET /projects/:projectId should respond with 404 if projectId exists but does not belong to user', (t) => {
  return request(app)
    .get('/projects/'+projectIds[2]) // project that belongs to another user
    .set('Authorization', authorization[0])
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND - user does not belong to this project');
    });
});

test('GET /projects/:projectId should respond with project details', (t) => {
  return request(app)
    .get('/projects/'+projectIds[0])
    .set('Authorization', authorization[0])
    .expect(200)
    .then((res) => {
      let project = res.body;
      t.pass('200 OK');
      t.assert(project.hasOwnProperty('users'), 'Project details should include users');
      t.assert(project.hasOwnProperty('sprints'), 'Project details should include sprints');
      t.assert(project.hasOwnProperty('tasks'), 'Project details should include tasks');
    });
});

test('PUT /projects/:projectId should modify project', (t) => {
  let params = {
    name: 'supermario'
  };

  return request(app)
    .put('/projects/'+projectIds[0])
    .set('Authorization', authorization[0])
    .send(params)
    .expect(200)
    .then((res) => {
      let project = res.body;
      t.pass('200 OK');
      t.equal(project.name, params.name, 'Project name should be updated');
      t.ok(project.updatedAt, 'Project should have updatedAt property');
    });
});

test('DELETE /projects/:projectId should delete a project and respond with 204', (t) => {
  // create a dummy project to be deleted
  return request(app)
    .delete('/projects/'+projectIds[1])
    .set('Authorization', authorization[0])
    .expect(204)
    .then((res) => {
      t.pass('204 NO CONTENT');
      return request(app)
        .get('/projects/'+projectIds[1])
        .set('Authorization', authorization[0])
        .expect(404);
    })
    .then((res) => {
      t.pass('404 NOT FOUND - project should no longer exist in database');
    });
});

test('/projects/:projectId should respond with 405 when using wrong HTTP method', (t) => {
  return request(app)
    .post('/projects/'+projectIds[0])
    .set('Authorization', authorization[0])
    .expect(405)
    .then(() => {
      t.pass('405 METHOD NOT ALLOWED');
    });
});

test('/projects should respond with 405 when using wrong HTTP method', (t) => {
  return request(app)
    .put('/projects')
    .set('Authorization', authorization[0])
    .expect(405)
    .then(() => {
      t.pass('405 METHOD NOT ALLOWED');
    });
});

after('After', (t) => {
  return models.sequelize.sync({
    force: true
  });
});
