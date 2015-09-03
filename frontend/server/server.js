import path from 'path';
import express from 'express';

let app = express();
app.use(express.static(path.join(__dirname, 'public')));

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Turtle frontend server listening on port ', port);
});
