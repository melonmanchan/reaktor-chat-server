import events  from '../socketio/eventtypes';
import { CHAT_CHANNEL } from '../utils/constants';

let pub = null;

function publishToRedisChannel(data, type) {
    pub.publish(CHAT_CHANNEL, JSON.stringify({ data, type }));
}

// User socket disconencted from the server
function pubUserDisconnected(user) {
    publishToRedisChannel(user, events.DISCONNECT);
}

// User has logged in succesfully and is connected
function pubUserLoggedIn(user) {
    publishToRedisChannel(user, events.NEW_CONNECTION);
}

// User has joined a channel
function pubUserJoinedChannel(data) {
    publishToRedisChannel(data, events.USER_JOINED);
}

// User has left a channel
function pubUserLeftChannel(data) {
    publishToRedisChannel(data, events.USER_LEFT);
}

function createRedisPub(client) {
    pub = client.duplicate();
}

export { createRedisPub, pubUserDisconnected, pubUserLoggedIn,
    pubUserJoinedChannel, pubUserLeftChannel };
