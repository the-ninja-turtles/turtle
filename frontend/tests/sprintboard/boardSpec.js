import test from 'blue-tape';
// import React from 'react/addons';
// import Reflux from 'reflux';
import createComponent from '../utils/create-component';
import {__RewireAPI__ as testmodule} from '../../src/components/sprintboard/board.jsx';
let SprintBoard =  testmodule.__GetDependency__('SprintBoard');
SprintBoard.prototype.getInitialState = () => {
  return {
    sprint: {
      columns: ['To Do', 'In Progress', 'Review', 'Done'],
      tasksByColumn: {}
    }
  };
};

let sprintBoard = createComponent(SprintBoard);

// console.log('methods', SprintBoard.prototype);
// console.log('component', sprintBoard);
// console.log('props', sprintBoard.props);
// console.log('props children', sprintBoard.props.children);

test('Sprint board is a div', (assert) => {
  assert.equal(sprintBoard.type, 'div',
    'Sprint board should be a div');
  assert.end();
});

test('Sprint board has a class "sprint-board"', (assert) => {
  assert.equal(sprintBoard.props.className, 'sprint-board',
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
