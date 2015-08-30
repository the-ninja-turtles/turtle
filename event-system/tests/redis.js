import events from 'events';
import util from 'util';
import redis from 'then-redis';
import fakeredis from 'fakeredis';

let redisEvents = [
  'ready', 'connect', 'reconnecting', 'error', 'end',
  'drain', 'idle', 'monitor', 'message', 'pmessage',
  'subscribe', 'psubscribe', 'unsubscribe', 'punsubscribe'
];

let createClient = (name) => {
  let client = Object.create(redis.Client.prototype);
  client._redisClient = fakeredis.createClient(name, '', {fast: true});

  events.EventEmitter.call(client);
  redisEvents.forEach((eventName) => {
    client._redisClient.on(eventName, client.emit.bind(client, eventName));
  }, client);
  util.inherits(client, events.EventEmitter);

  return client;
};

export default {createClient: createClient};
