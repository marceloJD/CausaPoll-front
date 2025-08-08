// src/sockets/socket.js
import { io } from 'socket.io-client';

const socket = io('https://mi-backend.com', {
  transports: ['websocket'], // evita fallback a polling si no lo deseas
  autoConnect: false,        // conectamos manualmente
});

export default socket;
