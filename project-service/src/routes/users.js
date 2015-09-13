import express from 'express';
import models from '../models';

let router = express.Router();

router.use((req, res, next) => {
  // find or create a user based on Auth0 user_id
  // and update username and email based on decoded jwt
  models.User.findOrCreate({
    where: {
      auth0Id: req.user.user_id
    }
  })
  .spread((user, created) => { // created = true if a new user was created
    return user.update({
      email: req.user.email,
      username: req.user.nickname,
      picture: req.user.picture
    });
  })
  .then((user) => {
    req.user.model = user; // store ORM model
    next();
  });
});

export default router;
