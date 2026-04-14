/**
 * Socket.IO server entry point for CodeX.
 * Features:
 * - WebSocket server setup
 * - Service initialization
 * - Message handling
 * - CORS configuration
 */

import type { SignalData } from 'simple-peer';
import { Server } from 'socket.io';
import { App } from 'uWebSockets.js';

import {
  CodeServiceMsg,
  PointerServiceMsg,
  RoomServiceMsg,
  ScrollServiceMsg,
  StreamServiceMsg
} from '@synccode/types/message';
import type { Cursor, EditOp } from '@synccode/types/operation';
import type { Pointer } from '@synccode/types/pointer';
import type { Scroll } from '@synccode/types/scroll';
import type { ExecutionResult } from '@synccode/types/terminal';

import * as codeService from '@/service/code-service';

import * as roomService from '@/service/room-service';
import * as userService from '@/service/user-service';
import * as webRTCService from '@/service/webrtc-service';

import { ALLOWED_ORIGINS} from './cors-config';

const PORT = 3001;

const app = App();

const io = new Server({
  cors: {
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
        return;
      }

      if (
        !origin ||
        ALLOWED_ORIGINS.includes(origin as (typeof ALLOWED_ORIGINS)[number])
      ) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed'));
      }
    },
    methods: ['GET', 'POST'], // Socket.IO needs both
    credentials: true
  },
  transports: ['websocket', 'polling']
});
io.attachApp(app);
io.engine.on('connection', rawSocket => {
  rawSocket.request = null;
});

app.listen(PORT, token => {
  if (!token) {
    console.warn(`Port ${PORT} is already in use`);
  }
  console.log(`server listening on port: ${PORT}`);
});

app.get('/', (res, req) => {
  res.writeHeader('Content-Type', 'text/plain');

  res.end('Server is Running');
});

io.on('connection', socket => {
  socket.on('ping', () => socket.emit('pong'));
  socket.on('disconnecting', () => roomService.leave(socket, io));
});
