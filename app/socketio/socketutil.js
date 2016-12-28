import { sockets, io } from './create';
import { decodeJWT, log, LOG_TYPES }   from '../utils';
import EVENT_TYPES  from './eventtypes';

function validateSocketJWT(socket) {
    return new Promise((resolve, reject) => {
        const token = socket.handshake.query.token;

        if (!token) {
            reject("No token found in query")
        }

        decodeJWT(token)
            .then(user => {
                resolve(user);
            })
            .catch(e => {
                reject(e);
            });
    });
}

function disconnectSocket(socket, disconnectEvent) {
    const i = sockets.indexOf(socket);

    if (i === -1) {
        return;
    }

    if (disconnectEvent) {
        socket.emit(disconnectEvent, {});
    }

    socket.disconnect(true)
    sockets.splice(i, 1);
}

function getSocketByUsername(name) {
    const socket = sockets.find(s => {
        return s.user.username === name;
    });

    return socket;
}

function joinChannel(username, roomName) {
    const socket = getSocketByUsername(username);
    const i = sockets.indexOf(socket);

    if (i === -1) {
        return;
    }

    sockets[i].join(roomName)
    sockets[i].user.rooms.push(roomName);
    io.to(roomName).emit('user:joined', { username });
}


function bindEventsToSocket(socket) {
    socket.on(EVENT_TYPES.DISCONNECT, () => {
        log(`Socket disconnected with id ${socket.id}`, LOG_TYPES.WARN);

        socket.user.rooms.map((r) => {
            const date = new Date();
            socket.broadcast.to(r).emit('user:quit', { username: socket.user.username });
        });

        disconnectSocket(socket);
    });

    socket.on(EVENT_TYPES.MESSAGE_POST, (data) => {
        const date = new Date();
        const channel = data.channel;
        const message = data.message;

        if (socket.user.rooms.includes(channel)) {
            socket.broadcast.to(channel).emit(EVENT_TYPES.MESSAGE_POST, { message , user: socket.user, date});
        }
    });

}

export { validateSocketJWT, disconnectSocket, bindEventsToSocket, getSocketByUsername, joinChannel }
