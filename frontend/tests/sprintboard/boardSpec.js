import test from 'blue-tape';
// import React from 'react/addons';
// import Reflux from 'reflux';
import createComponent from '../utils/create-component';
import SprintBoard from '../../src/components/sprintboard/board.jsx';

let sprintBoard = createComponent(SprintBoard);

// console.log('component', sprintBoard);
// console.log('props', component.props);
// console.log('props children', sprintBoard.props.children);

test('Sprint board is a div', (assert) => {
  assert.equal(sprintBoard.type, 'div',
    'Sprint board should be a div');
  assert.end();
});

test('Sprint board has a class "sprintBoard"', (assert) => {
  assert.equal(sprintBoard.props.className, 'sprintBoard',
    'Sprint board should have a class "sprintBoard"');
  assert.end();
});

test('Sprint board renders the correct number of columns', (assert) => {
  // this is a pretty stupid test, because I can not assign
  // an arbtrary number of columns during the test; it currently checks
  // that the number of columns is the same as in src/mock-data/sprint-columns.js file
  assert.equal(sprintBoard.props.children.length, 4,
    'Sprint board should render four sprint columns');
  assert.end();
});
