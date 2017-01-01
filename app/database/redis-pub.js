import cluster from 'cluster';

import events     from '../socketio/eventtypes';
import syncEvents from './synceventtypes';

import { CHAT_CHANNEL, SYNC_CHANNEL } from './channeltypes';

let pub = null;

function publishToRedisChannel(data, type) {
    pub.publish(CHAT_CHANNEL, JSON.stringify({ data, type }));
}

function publishToSyncChannel(data, type) {
    pub.publish(SYNC_CHANNEL, JSON.stringify({ data, type }));
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

function pubRequestSync() {
    publishToSyncChannel({ }, syncEvents.NEEDS_SYNC);
}

function pubSyncChatStore(data) {
    publishToSyncChannel(data, syncEvents.SYNC_EVENT);
}

function createRedisPub(client) {
    pub = client.duplicate();
}

export { createRedisPub, pubUserDisconnected, pubUserLoggedIn,
    pubUserJoinedChannel, pubUserLeftChannel, pubRequestSync, pubSyncChatStore };
