import test from 'blue-tape';
import createComponent from './utils/create-component';
import HelloWorld from '../src/components/hello.jsx.js';

let component = createComponent(HelloWorld, { addressee: 'test text' }, 'some child text');

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
