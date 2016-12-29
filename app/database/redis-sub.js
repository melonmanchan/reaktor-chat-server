import events from '../socketio/eventtypes';
import { CHAT_CHANNEL } from '../utils/constants';

let sub = null;

const subEvents = {
    [events.USER_JOINED]: subUserJoined,
    [events.USER_QUIT]: subUserLeft,
};

function subUserLeft(user) {
    console.log(payload);
}

function subUserJoined(user) {
    console.log(payload);
}

function createChatSub(client) {
    sub = client.duplicate();

    sub.on('message', (channel, message) => {
        const payload = JSON.parse(message);

        if (subEvents[payload.type]) {
            subEvents[payload.type](payload.data);
        }
    });

    sub.subscribe(CHAT_CHANNEL);
}

export { createChatSub };
