import test from 'blue-tape';
import React from 'react/addons'; // React is required here to render Task’s children
import createComponent from '../utils/create-component';
import SprintTask from '../../src/components/sprintboard/task.jsx';

let sprintTask = createComponent(SprintTask,
  {
    name: 'Test task',
    description: 'Description of a test task',
    assignedUser: 'Superman'
  }
);

test('Sprint task is a div', (assert) => {
  assert.equal(sprintTask.type, 'div',
    'Sprint task should be a div');
  assert.end();
});

test('Sprint task has a class "sprintTask"', (assert) => {
  assert.equal(sprintTask.props.className, 'sprintTask',
    'Sprint column should have a class "sprintTask"');
  assert.end();
});

test('Sprint task renders correctly', (assert) => {
  let expectedChildren = [
    <p>Test task</p>,
    <p>Description: {'Description of a test task'}</p>,
    <p>Assigned to: {'Superman'}</p>
  ];

  assert.deepEqual(sprintTask.props.children, expectedChildren,
    'Sprint task should render correctly');
  assert.end();
});
