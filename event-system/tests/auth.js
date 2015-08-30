import jwt from 'jsonwebtoken';

export const token = (id) => {
  return jwt.sign(profile(id), new Buffer(process.env.AUTH0_SECRET || 'secret', 'base64'), {audience: process.env.AUTH0_AUDIENCE || 'audience'});
};

export const authorization = (id) => {
  return 'Bearer ' + token(id);
};

export const fakeauth = (id) => {
  return (req, res, next) => {
    req.user = profile(id);
    next();
  };
};

export const profile = (id) => {
  return profiles[id];
};

const profiles = [
  {
    'email': 'test1@test.com',
    'connection': 'Username-Password-Authentication',
    'email_verified': true,
    'user_id': 'auth0|55e1c8c9cf1e612d550bcc45',
    'provider': 'auth0',
    'picture': 'https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png',
    'nickname': null,
    'identities': [
      {
        'connection': 'Username-Password-Authentication',
        'user_id': '55e1c8c9cf1e612d550bcc45',
        'provider': 'auth0',
        'isSocial': false
      }
    ],
    'updated_at': '2015-08-29T15:02:15.242Z',
    'created_at': '2015-08-29T14:59:21.044Z'
  }, {
    'email': 'test2@test.com',
    'connection': 'Username-Password-Authentication',
    'email_verified': true,
    'user_id': 'auth0|55e1c8c9cf1e612d550bdd46',
    'provider': 'auth0',
    'picture': 'https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png',
    'nickname': null,
    'identities': [
      {
        'connection': 'Username-Password-Authentication',
        'user_id': '55e1c8c9cf1e612d550bcc45',
        'provider': 'auth0',
        'isSocial': false
      }
    ],
    'updated_at': '2015-08-29T15:02:15.242Z',
    'created_at': '2015-08-29T14:59:21.044Z'
  }
];
