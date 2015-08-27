import jwt from 'jsonwebtoken';

const testUsers = [
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

const createToken = (user) => {
  return jwt.sign(user, new Buffer('secret', 'base64'), {audience: 'audience'});
};

export default testUsers.map(createToken).map((token) => 'Bearer ' + token);