import express from 'express';

let router = express.Router();

router.post('/publish/:namespace/:room', (req, res) => {
  /*
   * {event: eventName, data: payload}
   * 422 UNPROCESSABLE ENTITY {error: 'Expected application/json'}`
   */
  res.status(201).send();
});

router.all('/publish/:namespace/:room', (req, res) => {
  res.status(405).json({error: 'Use POST to publish an event'});
});

export default router;
