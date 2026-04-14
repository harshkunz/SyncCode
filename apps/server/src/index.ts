import type { SignalData } from 'simple-peer';
import { Server } from 'socket.io';
import { App } from 'uWebSockets.js';

const PORT = 3001;

const app = App();

const io = new Server({
    cors: {

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