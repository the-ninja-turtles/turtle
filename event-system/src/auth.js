import express from 'express';
import jwt from 'express-jwt';

let auth = (secret, audience) => {
  let router = express.Router();
  router.use(jwt({
    secret: new Buffer(secret, 'base64'),
    audience: audience
  }));

  router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error: err.message});
    }
  });

  return router;
};
export default auth;
