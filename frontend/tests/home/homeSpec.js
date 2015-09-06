import test from 'blue-tape';
import sinon from 'sinon';
import React from 'react/addons'; // React is required here to render Tasks
import createComponent from '../utils/create-component';
import Home from '../../src/components/home/home.jsx';

/* THIS IS FOR RENDERING AND TESTING AN INSTANCE OF A COMPONENT

let onLogin = () => {
  console.log('onlogin was called');
  return true;
};

let lock = {
  show(callback) {
    callback();
  }
};

let home = createComponent(Home, {lock: lock, onLogin: onLogin});

*/

//console.log('component', home);
//console.log('method', Home.prototype);

test('Login function should call showLock function if local storage is empty', (assert) => {
  global.localStorage = {getItem: () => {}};
  sinon.stub(Home.prototype, 'showLock');
  let mockEvent = {preventDefault: () => {
    return true;
  }};
  Home.prototype.login(mockEvent);

  assert.ok(Home.prototype.showLock.calledOnce,
    'showLock function should be called');
  Home.prototype.showLock.restore();
  assert.end();
});

test('Login function should call transitionTo method if local storage has token', (assert) => {
  sinon.stub(Home.prototype, 'transitionTo');
  let mockEvent = {preventDefault: () => {
    return true;
  }};
  global.localStorage = {getItem: (string) => {
    return true;
  }};
  Home.prototype.login(mockEvent);

  assert.ok(Home.prototype.transitionTo.calledOnce,
    'transitionTo function should be called');
  Home.prototype.transitionTo.restore();
  assert.end();
});
