import _ from 'lodash';
import test from 'blue-tape';
import request from 'supertest-as-promised';
import {authorization} from '../../tests/fakeauth.js';
import {publicApi, privateApi} from '../src/index.js';

const after = test;

test('Public API should respond with 401 Unauthorized when the Authorization header is not provided', (t) => {
  return request(publicApi)
    .get('/')
    .expect(401)
    .then(() => {
      t.pass('401 UNAUTHORIZED');
    });
});

test('Public API should respond with 404 when no route is found', (t) => {
  return request(publicApi)
    .get('/')
    .set('Authorization', authorization(0))
    .expect(404)
    .then(() => {
      t.pass('404 NOT FOUND');
    });
});

test('Private API should respond with 404 when no route is found', (t) => {
  return request(privateApi)
    .get('/')
    .expect(404)
    .then(() => {
      t.pass('404 NOT FOUND');
    });
});

after('After', () => {
  return new Promise((resolve) => {
    _.invoke([publicApi, privateApi], 'close');
    resolve();
  });
});
