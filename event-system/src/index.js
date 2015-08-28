import socketio from 'socket.io';

let io = socketio.listen(5000);

io.sockets.on('connection', (socket) => {
  socket.on('ping', (req) => {
    socket.emit('ping-reply', req);
  });
});

export default io;
