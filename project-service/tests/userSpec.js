import request from 'supertest-as-promised';
import test from 'blue-tape';
import {authorization, profile} from '../../tests/fakeauth';
import app from '../src/app';
import models from '../src/models';

const before = test;
const after = test;

before('Before', (t) => {
  // sync returns a promise
  return models.sequelize.sync({
    force: true
  })
  .then(() => { // create test user #0
    return models.User.create({
      auth0Id: profile(0).user_id,
      email: profile(0).email,
      username: profile(0).nickname
    });
  });
});

test('Public API should create a new user for any new valid Authorization headers', (t) => {
  let params = {
    where: {
      auth0Id: profile(1).user_id
    }
  };

  // first confirm that the user is not already in the database
  return models.User.findOne(params)
    .then((user) => {
      t.notok(user, 'User should not be in database initially');
      // send a get request with valid Authorization jwt
      return request(app)
        .get('/')
        .set('Authorization', authorization(1));
    })
    // confirm creation of user
    .then(() => {
      return models.User.findOne(params);
    })
    .then((user) => {
      t.ok(user, 'New user should be created');
    });
});

after('After', (t) => {
  return models.sequelize.sync({
    force: true
  });
});
