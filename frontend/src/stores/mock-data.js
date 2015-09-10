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
      status: 'Review',
      score: 10,
      rank: 50,
      user: {
        id: 2,
        username: 'mario'
      }
    }, {
      id: 2,
      name: 'do another task',
      description: 'some more description',
      status: 'In Progress',
      score: 8,
      rank: 51,
      user: {
        id: 3,
        username: 'boo'
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
      'username': 'wesley'
    }
  ],
  'sprints': [
    {
      'id': 1,
      'name': 'mvp',
      'status': 'Closed',
      'startDate': '2004-10-19 10:23:54+02',
      'endDate': '2004-10-19 10:23:54+02'
    },
    {
      'id': 2,
      'name': 'greenfield',
      'status': 'Not Started',
      'startDate': '',
      'endDate': ''
    }
  ],
  'tasks': [
    {
      'id': 1,
      'name': 'start the game',
      'description': 'click that green button',
      'status': 'To Do',
      'score': 1,
      'rank': 1,
      'userId': 1,
      'sprintId': 2
    },
    {
      'id': 2,
      'name': 'kill enemies',
      'description': 'jump on turtles',
      'status': 'To Do',
      'score': 10,
      'rank': 2,
      'userId': 1,
      'sprintId': null
    },
    {
      'id': 3,
      'name': 'finish the game',
      'description': 'do not let the time run out',
      'status': 'To Do',
      'score': 15,
      'rank': 3,
      'userId': 1,
      'sprintId': null
    },
    {
      'id': 4,
      'name': 'win',
      'description': 'save the princess',
      'status': 'To Do',
      'score': 15,
      'rank': 4,
      'userId': 1,
      'sprintId': null
    },
    {
      'id': 5,
      'name': 'celebrate',
      'description': 'throw a party',
      'status': 'To Do',
      'score': 10,
      'rank': 5,
      'userId': 2,
      'sprintId': null
    }
  ]
};
