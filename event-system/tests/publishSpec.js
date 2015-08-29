import test from 'blue-tape';
import request from 'supertest-as-promised';
import {publicApi, privateApi} from '../src/index.js';

const before = test;
const after = test;

before('before', (assert) => {
  return new Promise((resolve) => {
    resolve();
  });
});

test('POST /publish should respond with 201', (assert) => {
  return request(privateApi)
    .post('/publish/namespace/room')
    .expect(201);
});

test('/publish should respond with 405 when using wrong HTTP method', (assert) => {
  return request(privateApi)
    .get('/publish/namespace/room')
    .expect(405);
});

after('after', (assert) => {
  return new Promise((resolve) => {
    publicApi.close();
    privateApi.close();
    resolve();
  });
});
