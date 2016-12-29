import events  from '../socketio/eventtypes';
import { CHAT_CHANNEL } from '../utils/constants';

let pub = null;

function publishToChatChannel(data, type) {
    pub.publish(CHAT_CHANNEL, JSON.stringify({ data, type }));
}

function pubUserLeft(user) {
    publishToChatChannel(user, events.USER_LEFT );
}

function pubUserJoined(user) {
    publishToChatChannel(user, events.USER_JOINED);
}

function createChatPub(client) {
    pub = client.duplicate();
}

export { createChatPub, pubUserLeft, pubUserJoined };
