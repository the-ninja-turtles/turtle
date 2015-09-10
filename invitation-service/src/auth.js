import express from 'express';
import jwt from 'express-jwt';

let secret = process.env.AUTH0_SECRET || 'secret';
let audience = process.env.AUTH0_AUDIENCE || 'audience';

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

export default router;
