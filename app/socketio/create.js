import socketio      from 'socket.io';
import socketioRedis from 'socket.io-redis';

import EVENT_TYPES                                                                      from './eventtypes';
import config                                                                           from '../config/config';
import { log, LOG_TYPES }                                                               from '../utils';
import { pubUserLoggedIn }                                                                from '../database/redis-pub';
import { validateSocketJWT, getSocketByUsername, disconnectSocket, bindEventsToSocket } from './socketutil';

const sockets = [];
let io;

function createSocketIO(server) {
    io = socketio(server);
    io.adapter(socketioRedis({ port: config.redis_port, host: config.redis_host}));

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

                const loggedInUser = { username, channels: [] };

                pubUserLoggedIn(loggedInUser);

                socket.user = loggedInUser;
                sockets.push(socket);
                socket.emit(EVENT_TYPES.LOGGED_IN, {});
            })
            .catch(e => {
                console.log(e)
                disconnectSocket(socket, EVENT_TYPES.BAD_JWT);
            })
    });
}

export { sockets, createSocketIO, io };
