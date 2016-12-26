import http from 'http';
import socketio from 'socket.io';
import { log } from './utils';
import { config } from './config';

const app = http.createServer();
const io = socketio(app);

app.listen(config.port, () => {
    log(`Chat server listening at port ${config.port}`);
});
