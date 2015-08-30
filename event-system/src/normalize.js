import express from 'express';

let router = express.Router();

router.get('/subscribe/:namespace/:room/:jwt', (req, res, next) => {
  req.headers['authorization'] = 'Bearer ' + req.params.jwt;
  req.url = '/subscribe/' + req.params.namespace + '/' + req.params.room;
  next();
});

export default router;
