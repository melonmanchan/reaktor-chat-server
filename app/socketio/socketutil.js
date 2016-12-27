import { sockets, io } from './create';

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


export { getSocketByUsername, joinChannel }
