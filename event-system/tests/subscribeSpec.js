import test from 'blue-tape';
import request from 'supertest-as-promised';
import {publicApi, privateApi} from '../src/index.js';
import authorization from './jwtHelpers.js';

const before = test;
const after = test;

before('before', (assert) => {
  return new Promise((resolve) => {
    resolve();
  });
});

test('GET /subscriptions should respond with 200', (assert) => {
  return request(publicApi)
    .get('/subscriptions/namespace/room')
    .set('Authorization', authorization[0])
    .expect(200);
});

test('DELETE /subscriptions should respond with 200', (assert) => {
  return request(publicApi)
    .delete('/subscriptions/namespace/room')
    .set('Authorization', authorization[0])
    .expect(200);
});

test('/subscriptions should respond with 405 when using wrong HTTP method', (assert) => {
  return request(publicApi)
    .post('/subscriptions/namespace/room')
    .set('Authorization', authorization[0])
    .expect(405);
});

after('after', (assert) => {
  return new Promise((resolve) => {
    publicApi.close();
    privateApi.close();
    resolve();
  });
});
