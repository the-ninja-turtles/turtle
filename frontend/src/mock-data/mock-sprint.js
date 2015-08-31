let mockSprint = {
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
      user: {
        id: 2,
        username: 'mario'
      }
    }, {
      id: 2,
      name: 'do another task',
      description: 'some more description',
      status: 'In Progress',
      user: {
        id: 3,
        username: 'boo'
      }
    }
  ]
};

export default mockSprint;
