import http from 'http';
import express from 'express';

let app = express();
app.use(express.static(__dirname + '/../dist'));

let server = http.createServer(app);

server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', () => {
  let addr = server.address();
  console.log('Turtle frontend server listening at', addr.address + ':' + addr.port);
});
