import test from 'blue-tape';
import React from 'react/addons';
import Reflux from 'reflux';
import HelloWorld from '../src/components/hello.jsx';
import HelloStore from '../src/stores/helloStore';
import createComponent from './utils/create-component';
import App from '../src/components/hello-container.jsx.js';

let component = createComponent(App);

console.log('hello');
console.log("props", component.props);
console.log("props children", component.props.children);

test('see that the test runner runs', (assert) => {
  let a = 2;
  let b = 2;

  assert.equal(a, b,
    'Given two mismatched values, .equal() should produce a nice bug report');

  assert.end();

});
