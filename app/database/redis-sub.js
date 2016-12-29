import events from '../socketio/eventtypes';
import { ChatStore } from '../store';
import { CHAT_CHANNEL } from '../utils/constants';

let sub = null;

const subEvents = {
    [events.NEW_CONNECTION] : subUserLoggedIn,
    [events.DISCONNECT]     : subUserDisconnected,
    [events.USER_JOINED]    : subUserJoinedChannel,
    [events.USER_LEFT]      : subUserLeftChannel,
};

function subUserDisconnected(user) {
    ChatStore.removeUser(user);
}

function subUserLoggedIn(user) {
    ChatStore.addUser(user);
}

function subUserJoinedChannel(data) {
    ChatStore.addChannelToUser(data.channelKey, data.user);
}

function subUserLeftChannel(data) {
    ChatStore.removeChannelFromUser(data.channelKey, data.user);
}

function createRedisSub(client) {
    sub = client.duplicate();

    sub.on('message', (channel, message) => {
        const payload = JSON.parse(message);

        if (subEvents[payload.type]) {
            subEvents[payload.type](payload.data);
        }
    });

    sub.subscribe(CHAT_CHANNEL);
}

export { createRedisSub };
