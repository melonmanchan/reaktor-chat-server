import events from '../socketio/eventtypes';
import { CHAT_CHANNEL } from '../utils/constants';

let sub = null;

const subEvents = {
    [events.NEW_CONNECTION] : subUserDisconnected,
    [events.DISCONNECT]     : subUserLoggedIn,
    [events.USER_JOINED]    : subUserJoinedChannel,
    [events.USER_LEFT]      : subUserLeftChannel,
};

function subUserDisconnected(user) {
    // TODO
}

function subUserLoggedIn(user) {
    // TODO
}

function subUserJoinedChannel(data) {
    // TODO
}

function subUserLeftChannel(data) {
    // TODO
}

function createRedisSub(client) {
    sub = client.duplicate();

    sub.on('message', (channel, message) => {
        const payload = JSON.parse(message);

        console.log('Event ',  payload);
        if (subEvents[payload.type]) {
            subEvents[payload.type](payload.data);
        }
    });

    sub.subscribe(CHAT_CHANNEL);
}

export { createRedisSub };
