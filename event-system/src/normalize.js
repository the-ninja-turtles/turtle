import express from 'express';

let router = express.Router();

router.get('/subscribe/:namespace/:jwt', (req, res, next) => {
  req.headers['authorization'] = 'Bearer ' + req.params.jwt;
  req.url = '/subscribe/' + req.params.namespace;
  next();
});

export default router;
