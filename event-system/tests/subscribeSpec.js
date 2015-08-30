import _ from 'lodash';
import test from 'blue-tape';
import sinon from 'sinon';
import express from 'express';
import bodyparser from 'body-parser';
import EventSource from 'eventsource';
import request from 'supertest-as-promised';
import redis from './redis.js';
import {fakeauth, profile, token, authorization} from './auth.js';
import normalize from '../src/normalize.js';
import subscribe from '../src/subscribe.js';

const beforeEach = (dbName) => {
  subscribe.__Rewire__('redis', {createClient: redis.createClient.bind(null, dbName)});

  let app = express();
  app.use(bodyparser.json());
  app.use(fakeauth(0));
  app.use(subscribe);
  return app.listen(9000);
};

const url = (path) => {
  return 'http://127.0.0.1:9000' + path;
};

test('Check authorization normalization for SSE requests', (t) => {
  let app = express();
  app.use(normalize);
  app.get('/subscribe/:namespace/:room', (req, res) => {
    t.equals(req.get('Authorization'), authorization(0), 'Request was normalized');
    res.send();
  });

  return request(app)
    .get('/subscribe/namespace/room/' + token(0))
    .expect(200);
});

test('GET /subscribe/:namespace/:room should receive events published to namespace:room', (t) => {
  return new Promise((resolve) => {
    let app = beforeEach('subscribe');
    let client = redis.createClient('subscribe');
    let spy = sinon.spy();

    let es = new EventSource(url('/subscribe/namespace/room'));

    es.on('open', () => {
      client.publish('namespace:room', JSON.stringify({
        event: 'task:change',
        data: 23,
        acl: [profile(0).user_id]
      }));
    });

    es.on('task:change', spy);

    _.delay(() => {
      t.assert(spy.calledWith(sinon.match({data: '23'})), 'Event was received');
      _.invoke([app, es], 'close');
      resolve();
    }, 200);
  });
});

test('GET /subscribe/:namespace/:room should not send events if user is not in acl', (t) => {
  return new Promise((resolve, reject) => {
    let app = beforeEach('acl').listen(9000);
    let client = redis.createClient('acl');

    let es = new EventSource(url('/subscribe/namespace/room'));

    es.on('open', () => {
      client.publish('namespace:room', JSON.stringify({
        event: 'task:change',
        data: 23,
        acl: [profile(1).user_id]
      }));
    });

    es.on('task:change', reject);

    _.delay(() => {
      t.pass('Event was not sent');
      _.invoke([app, es], 'close');
      resolve();
    }, 200);
  });
});

test('GET /subscribe/:namespace/:room should respond with previous event when Last-Event-ID is set', (t) => {
  let app = beforeEach('last-event-id').listen(9000);
  let client = redis.createClient('last-event-id');
  let spy = sinon.spy();

  let createEvent = (id, projectId, profileId) => {
    return JSON.stringify({
      id: id,
      event: 'task:change',
      channel: 'projects:' + projectId,
      acl: [profile(profileId).user_id]
    });
  };

  return client.mset({
    'current-event-id': 10,
    5: createEvent(5, 0, 1),
    6: createEvent(6, 0, 0),
    7: createEvent(7, 1, 0),
    8: createEvent(8, 3, 0),
    9: createEvent(9, 0, 1),
    10: createEvent(10, 0, 0)
  }).then(() => {
    return new Promise((resolve) => {
      let es = new EventSource(url('/subscribe/projects/0'), {headers: {'Last-Event-ID': '3'}});
      es.on('task:change', spy);

      _.delay(() => {
        t.assert(spy.calledTwice, 'Two events were received');
        t.assert(spy.calledWith(sinon.match({lastEventId: '6'})), 'Event with id: 6 was received');
        t.assert(spy.calledWith(sinon.match({lastEventId: '10'})), 'Event with id: 10 was received');
        _.invoke([app, es], 'close');
        resolve();
      }, 200);
    });
  });
});
