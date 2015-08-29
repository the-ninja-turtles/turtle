import express from 'express';

let router = express.Router();

/*
 * 404 NOT FOUND {error: 'Unknown namespace/room'}
 */

router.get('/subscriptions/:namespace/:room', (req, res) => {
  res.send();
});

router.delete('/subscriptions/:namespace/:room', (req, res) => {
  res.send();
});

router.all('/subscriptions/:namespace/:room', (req, res) => {
  res.status(405).json({error: 'Use GET to subscribe and DELETE to unsubscribe'});
});

export default router;
