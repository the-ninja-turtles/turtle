import http from 'http';
import path from 'path';
import express from 'express';

let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/../dist'));

let server = http.createServer(app);

app.get('*', (req, res) => {
  res.render('index.ejs');
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', () => {
  let addr = server.address();
  console.log('Turtle frontend server listening at', addr.address + ':' + addr.port);
});
