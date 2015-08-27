import app from './app';
import models from './models';

// create tables and listen
let port = process.env.PORT || 3000;
models.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log('Listening on port', port);
  });
});
