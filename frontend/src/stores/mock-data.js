export const MockSprint = {
  id: 1,
  name: 'mvp',
  status: 'Started',
  startDate: '',
  endDate: '',
  tasks: [
    {
      id: 1,
      name: 'do a task',
      description: 'some description',
      status: 0,
      score: 10,
      user: {
        id: 2,
        username: 'mario',
        picture: 'https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png'
      }
    }, {
      id: 2,
      name: 'do another task',
      description: 'some more description',
      status: 1,
      score: 8,
      user: {
        id: 3,
        username: 'boo',
        picture: 'https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png'
      }
    }
  ]
};


export const MockProject = {
  'id': 1,
  'name': 'greenfield',
  'users': [
    {
      'id': 1,
      'email': 'something@turtle.com',
      'username': 'wesley',
      picture: 'https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png'
    },
    {
      'id': 2,
      'email': 'something@turtle.com',
      'username': 'wesley',
      picture: 'https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png'
    }
  ],
  currentSprint: {
    'id': 1,
    'name': 'mvp',
    'length': 7,
    'startDate': '2004-10-19 10:23:54+02',
    tasks: [
      {
        'id': 2,
        'name': 'kill enemies',
        'description': 'jump on turtles',
        'status': 0,
        'score': 10,
        'sprintId': 1,
        'userId': 1
      },
      {
        'id': 1,
        'name': 'start the game',
        'description': 'click that green button',
        'status': 0,
        'score': 1,
        'sprintId': 1,
        'userId': 1
      }
    ]
  },
  nextSprint: {
    'id': 2,
    'name': 'greenfield',
    'length': 7,
    tasks: [
      {
        'id': 0,
        'name': 'finish the game',
        'description': 'do not let the time run out',
        'status': 0,
        'score': 15,
        'sprintId': 2,
        'userId': 1
      }
    ]
  },
  backlog: [
    {
      'id': 8,
      'name': 'win',
      'description': 'save the princess',
      'status': 0,
      'score': 15,
      'sprintId': null,
      'userId': 1
    },
    {
      'id': 5,
      'name': 'celebrate',
      'description': 'throw a party',
      'status': 0,
      'score': 10,
      'sprintId': null,
      'userId': 2
    }
  ]
};
