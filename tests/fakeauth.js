import jwt from 'jsonwebtoken';

export const token = (id) => {
  let secret = process.env.AUTH0_SECRET || 'secret';
  let audience = process.env.AUTH0_AUDIENCE || 'audience';
  return jwt.sign(profile(id), new Buffer(secret, 'base64'), {audience: audience});
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
    user_id: 'auth0|user-1',
    nickname: 'bob',
    email: 'bob@test.com',
    picture: 'https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png'
  }, {
    user_id: 'auth0|user-2',
    nickname: 'mike',
    email: 'mike@test.com',
    picture: 'https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png'
  }
];
