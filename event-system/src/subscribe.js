import _ from 'lodash';
import express from 'express';
import redis from './redis.js';

let router = express.Router();

router.get('/subscribe/:namespace/:room', (req, res) => {
  let client = redis.createClient();

  res.set('Content-Type', 'text/event-stream')
    .set('Cache-Control', 'no-cache')
    .set('Connection', 'keep-alive')
    .write('\n');

  let subscriber = redis.createClient();
  let channel = req.params.namespace + ':' + req.params.room;

  subscriber.subscribe(channel);

  subscriber.on('message', (channel, message) => {
    let event = JSON.parse(message);
    if (isAuthorized(event.acl)) {
      sendEvent(event.id, event.event, event.data);
    }
  });

  let lastEventId = parseInt(req.get('Last-Event-ID'));
  if (lastEventId) {
    client.get('current-event-id').then((value) => {
      client.mget.apply(client, _.map(new Array(value - lastEventId + 1), (elem, i) => {
        return lastEventId + i;
      })).then((values) => {
        return _.map(values, JSON.parse);
      }).then((events) => {
        return _.filter(events, (event) => {
          if (event) {
            return event.channel === channel && isAuthorized(event.acl);
          }
        });
      }).then((events) => {
        _.each(events, (event) => {
          sendEvent(event.id, event.event, event.data);
        });
      });
    });
  }

  let isAuthorized = (acl) => {
    return _.some(acl, (rule) => {
      return rule === '*' || rule === req.user.user_id;
    });
  };

  let sendEvent = (id, event, data) => {
    res.write('id: ' + id + '\n');
    res.write('event: ' + event + '\n');
    res.write('data: ' + data + '\n\n');
  };

  req.on('close', () => {
    subscriber.unsubscribe();
    subscriber.quit();
  });
});

export default router;
