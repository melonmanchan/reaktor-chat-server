import socketio from 'socket.io';

import { log, LOG_TYPES } from '../utils';
import { decodeJWT }      from '../utils/jwt';
import EVENT_TYPES        from './eventtypes';

const sockets = [];
let io;

function createSocketIO(server) {
    io = socketio(server);

    io.on(EVENT_TYPES.NEW_CONNECTION, (socket) => {
        const token = socket.handshake.query.token;

        if (!token) {
            socket.disconnect(true);
            return;
        }

        decodeJWT(token)
            .then((user) => {
                const username = user.name;

                const existing = sockets.find(s => {
                    return s.user.username === username
                });

                if (existing) {
                    log('Name is taken!', LOG_TYPES.warn);
                    socket.emit(EVENT_TYPES.NAME_TAKEN, {});
                    socket.disconnect(true);
                    return;
                }

                log('New client connected: ' + username);

                socket.on(EVENT_TYPES.DISCONNECT, () => {
                    log(`Socket disconnected with id ${socket.id}`, LOG_TYPES.WARN);

                    const i = sockets.indexOf(socket);

                    if (i === -1) {
                        return;
                    }

                    sockets.splice(i, 1);
                });

                socket.user = { username };
                socket.user.rooms = [];
                sockets.push(socket);
                socket.emit(EVENT_TYPES.LOGGED_IN, {});

            })
            .catch(e => {
                socket.emit(EVENT_TYPES.BAD_JWT, {});
                socket.disconnect(true);
            });

    });
}

export { sockets, createSocketIO, io };
