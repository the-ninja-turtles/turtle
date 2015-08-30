import test from 'blue-tape';
import express from 'express';
import bodyparser from 'body-parser';
import sinon from 'sinon';
import request from 'supertest-as-promised';
import redis from './redis.js';
import publish from '../src/publish.js';

const beforeEach = (dbName) => {
  publish.__Rewire__('redis', {createClient: redis.createClient.bind(null, dbName)});

  let app = express();
  app.use(bodyparser.json());
  app.use(publish);
  return app;
};

test('POST /publish should respond with 400 when event property is missing', (t) => {
  let app = beforeEach();

  return request(app)
    .post('/publish/namespace/room')
    .expect(400)
    .then(() => {
      t.pass('400 BAD REQUEST');
    });
});

test('POST /publish publish event and respond with 201', (t) => {
  let app = beforeEach('publish');
  let spy = sinon.spy();
  let client = redis.createClient('publish');

  client.subscribe('namespace:room');
  client.on('message', spy);

  return request(app)
    .post('/publish/namespace/room')
    .send({event: 'task:change'})
    .expect(201)
    .then(() => {
      t.pass('201 CREATED');
      client.unsubscribe();
      t.assert(spy.called, 'Event was published');
    });
});

test('POST /publish increments current event id and writes the event data to redis', (t) => {
  let app = beforeEach('increment');
  let client = redis.createClient('increment');

  return request(app)
    .post('/publish/namespace/room')
    .send({event: 'task:change'})
    .then(() => {
      return client.get('current-event-id');
    }).then((value) => {
      t.equal(value, 1, 'Current event id is incremented');
    }).then(() => {
      return client.get('0');
    }).then(JSON.parse)
    .then((value) => {
      t.equal(value.id, 0, 'ID is set to correct value');
      t.equal(value.event, 'task:change', 'Event name is stored');
      t.equal(value.channel, 'namespace:room', 'Event channel is set');
      t.equal(value.acl[0], '*', 'Event ACL is set to default');
    });
});

test('/publish should respond with 405 when using wrong HTTP method', (t) => {
  let app = beforeEach();

  return request(app)
    .get('/publish/namespace/room')
    .expect(405)
    .then(() => {
      t.pass('405 METHOD NOT ALLOWED');
    });
});
