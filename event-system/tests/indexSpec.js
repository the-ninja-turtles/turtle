import test from 'blue-tape';
import request from 'supertest-as-promised';
import {publicApi, privateApi} from '../src/index.js';
import authorization from './jwtHelpers.js';

const after = test;

test('Public API should respond with 401 Unauthorized when the Authorization header is not provided', (assert) => {
  return request(publicApi)
    .get('/')
    .expect(401);
});

test('Public API should respond with 404 when no route is found', (assert) => {
  return request(publicApi)
    .get('/')
    .set('Authorization', authorization[0])
    .expect(404);
});

test('Private API should respond with 404 when no route is found', (assert) => {
  return request(privateApi)
    .get('/')
    .expect(404);
});

after('after', (assert) => {
  return new Promise((resolve) => {
    publicApi.close();
    privateApi.close();
    resolve();
  });
});
