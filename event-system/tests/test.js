import test from 'blue-tape';
import io from 'socket.io-client';
import server from '../src/index.js';

// const before = test;
const after = test;

let socketURL = 'http://0.0.0.0:5000';

let options = {
  transports: ['websocket'],
  'force new connection': true
};

test('the server should respond to a ping with a ping-reply', (assert) => {
  return new Promise((resolve) => {
    let client = io.connect(socketURL, options);
    let value = Math.random();

    client.emit('ping', value);
    client.on('ping-reply', (res) => {
      assert.equal(value, res);
      client.disconnect();
      resolve();
    });
  });
});

after('after', (assert) => {
  return new Promise((resolve) => {
    server.close();
    resolve();
  });
});
