const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

let io;

// Secure WebSocket connections with JWT validation
function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = user;
      next();
    });
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user);

    socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
      console.log(`User ${socket.user} joined group ${groupId}`);
    });

    socket.on('sendMessage', ({ groupId, message }) => {
      io.to(groupId).emit('receiveMessage', { groupId, message });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user);
    });
  });

  return io;
}

module.exports = { initializeSocket };