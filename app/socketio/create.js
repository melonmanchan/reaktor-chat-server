import socketio from 'socket.io';

import { log, LOG_TYPES } from '../utils';
import EVENT_TYPES        from './eventtypes';
import { validateSocketJWT, getSocketByUsername, disconnectSocket, bindEventsToSocket } from './socketutil';

const sockets = [];
let io;

function createSocketIO(server) {
    io = socketio(server);

    io.on(EVENT_TYPES.NEW_CONNECTION, (socket) => {

        validateSocketJWT(socket)
            .then(user => {
                const username = user.name;

                const existing = getSocketByUsername(username)

                if (existing) {
                    log('Name is taken!', LOG_TYPES.warn);
                    socket.emit(EVENT_TYPES.NAME_TAKEN, {});
                    socket.disconnect(true);
                    return;
                }

                log('New client connected: ' + username);

                bindEventsToSocket(socket);

                socket.user = { username };
                socket.user.rooms = [];
                sockets.push(socket);
                socket.emit(EVENT_TYPES.LOGGED_IN, {});
            })
            .catch(e => {
                disconnectSocket(socket, EVENT_TYPES.BAD_JWT);
            })
    });
}

export { sockets, createSocketIO, io };
