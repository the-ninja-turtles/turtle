import jwt from 'jsonwebtoken';

process.env.NODE_ENV = 'test';

export const profiles = [
  {
    'email': 'test1@test.com',
    'connection': 'Username-Password-Authentication',
    'email_verified': true,
    'user_id': 'auth0|55e1c8c9cf1e612d550bcc45',
    'provider': 'auth0',
    'picture': 'https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png',
    'nickname': 'john',
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
    'nickname': 'arya',
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
  return jwt.sign(user, new Buffer(process.env.AUTH0_SECRET || 'secret', 'base64'), {audience: process.env.AUTH0_AUDIENCE || 'audience'});
};

export default profiles.map(createToken).map((token) => 'Bearer ' + token);

export const projects = [
  {
    name: 'apocalypse'
  },
  {
    name: 'railroad'
  },
  {
    name: 'to be deleted'
  }
];

export const sprints = [
  {
    name: 'build army',
    status: 'In Progress',
    startDate: new Date(2015, 9, 1),
    endDate: new Date(2015, 9, 8)
  },
  {
    name: 'ravage cities',
    status: 'Not Started',
    startDate: new Date(2015, 9, 9),
    endDate: new Date(2015, 9, 16)
  },
  {
    name: 'perform monologue',
    status: 'Not Started',
    startDate: new Date(2015, 9, 17),
    endDate: new Date(2015, 9, 24)
  }
];

export const tasks = [
  {
    name: 'hire minions',
    description: 'hire incompetent goons to do biddings',
    status: 'Ready',
    score: 20,
    rank: 80
  },
  {
    name: 'train minions',
    description: 'give them weapons and teach them to miss',
    status: 'Ready',
    score: 10,
    rank: 60
  },
  {
    name: 'buy plane tickets',
    description: 'look for group discounts for larger armies (why are we flying commercial?)',
    status: 'In Progress',
    score: 5,
    rank: 75
  },
  {
    name: 'destroy cities',
    description: 'but all the plane tickets to populous cities are expensive...',
    status: 'Backlog',
    score: 100,
    rank: 20
  },
  {
    name: 'draft monologue',
    description: 'needs to be just long enough to ensure unexpected interruptions',
    status: 'In Review',
    score: 40,
    rank: 40
  }
];
