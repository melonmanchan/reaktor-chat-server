import express  from 'express';
import http     from 'http';
import socketio from 'socket.io';

import { log }    from './utils';
import { config } from './config';

const app = express();
const server = http.Server(app);
const io = socketio(server);

server.listen(config.port, () => {
    log(`Chat server listening at port ${config.port}`);
});
