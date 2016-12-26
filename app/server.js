import http from 'http';
import socketio from 'socket.io';
import { log } from './utils';

const app = http.createServer();
const io = socketio(app);

app.listen(8000, () => {
    log('Chat server listening at port 8000');
});
