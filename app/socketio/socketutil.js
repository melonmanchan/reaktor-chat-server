import { sockets, io } from './create';
import events from './eventtypes';
import pub from '../database/redis-pub'
import { pubUserLeft, pubUserJoinedChannel,
    pubUserDisconnected, pubUserLeftChannel } from '../database/redis-pub';
import { decodeJWT, log, LOG_TYPES }   from '../utils';
import { ChatStore } from '../store';
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
    if (disconnectEvent) {
        socket.emit(disconnectEvent, {});
    }

    socket.disconnect(true);

    ChatStore.deleteSocket(socket);
}

function joinChannel(username, channelKey) {
    const socket = ChatStore.getSocketByUsername(username);

    if (!socket) {
        return;
    }

    socket.join(channelKey)
    io.to(channelKey).emit(events.USER_JOINED, { username });
    pubUserJoinedChannel({ channelKey, user: ChatStore.getUserByName(username) });
}


function bindEventsToSocket(socket) {
    socket.on(EVENT_TYPES.DISCONNECT, () => {
        log(`Socket disconnected with id ${socket.id}`, LOG_TYPES.WARN);

        const user = ChatStore.getUserBySocket(socket);

        user.channels.map((c) => {
            const date = new Date();
            socket.broadcast.to(c).emit(events.USER_QUIT, { username: user.username });
        });

        disconnectSocket(socket);
        pubUserDisconnected(user);
    });

    socket.on(EVENT_TYPES.MESSAGE_POST, (data) => {
        const user = ChatStore.getUserBySocket(socket);
        const date = new Date();
        const channel = data.channel;
        const message = data.message;

        if (!channel && !message) {
            return;
        }

        if (user.channels.includes(channel)) {
            socket.broadcast.to(channel).emit(EVENT_TYPES.MESSAGE_POST, { message , user: user, date});
        }
    });

}

export { validateSocketJWT, disconnectSocket, bindEventsToSocket, joinChannel };
