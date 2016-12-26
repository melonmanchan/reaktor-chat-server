import express  from 'express';
import http     from 'http';

import { config }         from './config';
import { createSocketIO } from './socketio';
import { log }            from './utils';

const app = express();
const server = http.Server(app);
createSocketIO(server);

server.listen(config.port, () => {
    log(`Chat server listening at port ${config.port}`);
});
