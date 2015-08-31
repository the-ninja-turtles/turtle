import test from 'blue-tape';
import React from 'react/addons'; // React is required here to render Tasks
import createComponent from '../utils/create-component';
import SprintColumn from '../../src/components/sprintboard/column.jsx';
import Task from '../../src/components/sprintboard/task.jsx';

// mock tasks that are going to be provided as a property of a column
let tasks = [
  {name: 'task1', description: 'description1', user: 'user1', status: 'Test'},
  {name: 'task2', description: 'description2', user: 'user2', status: 'Test'},
  // the following task shouldn't get rendered, because its status is different from column name
  {name: 'task2', description: 'description2', user: 'user2', status: 'Todo'}
];

let sprintColumn = createComponent(SprintColumn, { columnName: 'Test', tasks: tasks});

test('Sprint column is a div', (assert) => {
  assert.equal(sprintColumn.type, 'div',
    'Sprint column should be a div');
  assert.end();
});

test('Sprint column has a class "sprintColumn"', (assert) => {
  assert.equal(sprintColumn.props.className, 'sprintColumn',
    'Sprint column should have a class "sprintColumn"');
  assert.end();
});

test('Sprint column renders correct number of tasks', (assert) => {
  let expectedChildren = [
    <p className="columnName">Test</p>,
    [<Task
      name='task1'
      description='description1'
      assignedUser='user1'
    />,
    <Task
      name='task2'
      description='description2'
      assignedUser='user2'
    />,
    undefined // this is the third task, whose status does not equal the column name
    ]
  ];
  assert.deepEqual(sprintColumn.props.children, expectedChildren,
    'Sprint column should render correctly');
  assert.end();
});
