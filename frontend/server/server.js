import path from 'path';
import express from 'express';

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.render('index.ejs');
});

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Turtle frontend server listening on port ', port);
});
