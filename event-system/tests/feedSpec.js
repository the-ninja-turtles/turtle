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

test('GET /feed should keep connection alive', (assert) => {
  return request(publicApi)
    .get('/feed')
    .set('Authorization', authorization[0])
    .expect(200);
});

test('/feed should respond with 405 when using wrong HTTP method', (assert) => {
  return request(publicApi)
    .post('/feed')
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
