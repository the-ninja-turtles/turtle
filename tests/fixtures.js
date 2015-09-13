export const projects = [
  {
    name: 'apocalypse',
    emails: []
  },
  {
    name: 'railroad',
    emails: ['bob@test.com', 'mike@test.com']
  },
  {
    name: 'to be deleted',
    emails: ['mike@test.com']
  }
];

export const sprints = [
  {
    name: 'build army',
    status: 1,
    startDate: new Date(2015, 9, 1),
    endDate: new Date(2015, 9, 8)
  },
  {
    name: 'ravage cities',
    status: 0,
    startDate: new Date(2015, 9, 9),
    endDate: new Date(2015, 9, 16)
  },
  {
    name: 'perform monologue',
    status: 0,
    startDate: new Date(2015, 9, 17),
    endDate: new Date(2015, 9, 24)
  }
];

export const tasks = [
  {
    name: 'hire minions',
    description: 'hire incompetent goons to do biddings',
    status: 0,
    score: 20
  },
  {
    name: 'train minions',
    description: 'give them weapons and teach them to miss',
    status: 0,
    score: 10
  },
  {
    name: 'buy plane tickets',
    description: 'look for group discounts for larger armies (why are we flying commercial?)',
    status: 1,
    score: 5
  },
  {
    name: 'destroy cities',
    description: 'but all the plane tickets to populous cities are expensive...',
    status: 0,
    score: 100
  },
  {
    name: 'draft monologue',
    description: 'needs to be just long enough to ensure unexpected interruptions',
    status: 2,
    score: 40
  }
];
