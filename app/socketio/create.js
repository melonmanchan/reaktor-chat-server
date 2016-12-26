import socketio from 'socket.io';
import { log, LOG_TYPES } from '../utils';

const sockets = [];

function createSocketIO(server) {
    const io = socketio(server);

    io.on('connection', (socket) => {
        log('New socket with id: ' + socket.id);
        sockets.push(socket);

        socket.on('disconnect', () => {
            log('Socket disconnect with id' + socket.id, LOG_TYPES.WARNING);
            const i = connections.indexOf(socket);
            if (i === -1) return;
            const user = socket.user;

            connections.splice(i, 1);
        });
    });
}

export { sockets, createSocketIO };
