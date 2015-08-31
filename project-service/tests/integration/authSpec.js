import request from 'supertest-as-promised';
import test from 'blue-tape';
import authorization from '../fixtures';
import app from '../../src/app';
import models from '../../src/models';

const before = test;

before('Before', (t) => {
  // sync returns a promise
  return models.sequelize.sync();
});

test('Public API should respond with 401 Unauthorized when Authorization header is not provided', (t) => {
  return request(app)
    .get('/')
    .expect(401)
    .then((res) => {
      t.pass('401 UNAUTHORIZED'); // t.equal(401, res.status);
    });
});

test('Public API should respond with 404 when no route is found', (t) => {
  return request(app)
    .get('/')
    .set('Authorization', authorization[0])
    .expect(404)
    .then((res) => {
      t.pass('404 NOT FOUND'); // t.equal(404, res.status);
    });
});
