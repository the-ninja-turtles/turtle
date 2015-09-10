import _ from 'lodash';
import express from 'express';
import redis from './redis.js';

let router = express.Router();

router.post('/publish/:namespace', (req, res) => {
  let client = redis.createClient();
  let acl = req.body.acl || ['*'];

  if (!_.isString(req.body.event) || !_.isArray(acl)) {
    return res.status(400).json({error: 'Property event must be a string and property acl must be an array'});
  }

  let event = {
    event: req.body.event,
    data: req.body.data,
    channel: req.params.namespace,
    acl: acl
  };

  client.publish(req.params.namespace, JSON.stringify(event)).then(() => {
    return client.incr('current-event-id');
  }).then((id) => {
    event.id = id - 1;
    return client.setex(event.id, 300, JSON.stringify(event));
  }).then(() => {
    res.status(201).send();
  }).catch((error) => {
    console.error(error);
    res.status(500).json({error: 'try again later'});
  });
});

router.all('/publish/:namespace', (req, res) => {
  res.status(405).json({error: 'Use POST to publish an event'});
});

export default router;
