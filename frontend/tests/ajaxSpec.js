import _ from 'lodash';
import test from 'blue-tape';
import sinon from 'sinon';
import projects from '../src/ajax/projects.js';

let beforeEach = () => {
  let spy = sinon.spy();
  projects.__Rewire__('request', spy);
  return spy;
};

test('Fetching projects should get /projects', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();

    projects.fetch();
    t.ok(spy.calledWith('GET', '/projects'), 'GET /projects');

    resolve();
  });
});

test('Creating a project should post to /projects', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();
    let data = {};

    projects.create(data);
    t.ok(spy.calledWith('POST', '/projects', data), 'POST /projects');

    resolve();
  });
});

test('Fetching a project should get /projects/:id', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();

    projects.id(0).fetch();
    t.ok(spy.calledWith('GET', '/projects/0'), 'GET /projects/:id');

    resolve();
  });
});

test('Updating a project should put /projects/:id', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();
    let data = {};

    projects.id(0).update(data);
    t.ok(spy.calledWith('PUT', '/projects/0', data), 'PUT /projects/:id');

    resolve();
  });
});

test('Deleting a project should delete /projects/:id', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();

    projects.id(0).delete();
    t.ok(spy.calledWith('DELETE', '/projects/0'), 'DELETE /projects/:id');

    resolve();
  });
});


test('Fetching sprints should get /projects/:id/sprints', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();

    projects.id(0).sprints.fetch();
    t.ok(spy.calledWith('GET', '/projects/0/sprints'), 'GET /projects/:id/sprints');

    resolve();
  });
});

test('Creating a sprint should post to /projects/:id/sprints', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();
    let data = {};

    projects.id(0).sprints.create(data);
    t.ok(spy.calledWith('POST', '/projects/0/sprints', data), 'POST /projects/:id/sprints');

    resolve();
  });
});

test('Fetching a sprint should get /projects/:id/sprints/:id', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();

    projects.id(0).sprints.id(0).fetch();
    t.ok(spy.calledWith('GET', '/projects/0/sprints/0'), 'GET /projects/:id/sprints/:id');

    resolve();
  });
});

test('Updating a sprint should put /projects/:id/sprints/:id', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();
    let data = {};

    projects.id(0).sprints.id(0).update(data);
    t.ok(spy.calledWith('PUT', '/projects/0/sprints/0', data), 'PUT /projects/:id/sprints/:id');

    resolve();
  });
});

test('Deleting a sprint should delete /projects/:id/sprints/:id', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();

    projects.id(0).sprints.id(0).delete();
    t.ok(spy.calledWith('DELETE', '/projects/0/sprints/0'), 'DELETE /projects/:id/sprints/:id');

    resolve();
  });
});

test('Assigning task to sprint should POST /projects/:id/sprints/:id/assigntasks', (t) => {
  return new Promise((resolve) => {
    let spy = beforeEach();
    let data = {};

    projects.id(0).sprints.id(0).assigntasks(data);
    t.ok(spy.calledWith('POST', '/projects/0/sprints/0/assigntasks', data), 'POST /projects/:id/sprints/:id/assigntasks');

    resolve();
  });
});


test('Using on on a collection should register a callback to the event', (t) => {
  return new Promise((resolve) => {
    let spy = sinon.spy();
    projects.__Rewire__('subscription', () => {
      return {on: spy};
    });

    projects.on('change', _.identity);
    t.ok(spy.calledWith('project', 'change', _.identity), 'Added event handler to project');

    projects.id(0).on('change', _.identity);
    t.ok(spy.calledWith('project', 'change', _.identity), 'Added event handler to project');

    projects.id(0).sprints.on('change', _.identity);
    t.ok(spy.calledWith('sprint', 'change', _.identity), 'Added event handler to sprints');

    projects.id(0).sprints.id(0).on('change', _.identity);
    t.ok(spy.calledWith('sprint', 'change', _.identity), 'Added event handler to sprints');

    projects.id(0).tasks.on('change', _.identity);
    t.ok(spy.calledWith('task', 'change', _.identity), 'Added event handler to tasks');

    projects.id(0).tasks.id(0).on('change', _.identity);
    t.ok(spy.calledWith('task', 'change', _.identity), 'Added event handler to tasks');

    resolve();
  });
});
