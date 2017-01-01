import cluster from 'cluster';

import events     from '../socketio/eventtypes';
import syncEvents from './synceventtypes';

import { ChatStore }                        from '../store';
import { CHAT_CHANNEL, SYNC_CHANNEL }       from './channeltypes';
import { pubRequestSync, pubSyncChatStore } from './redis-pub';

let sub = null;

const subEvents = {
    [events.NEW_CONNECTION] : subUserLoggedIn,
    [events.DISCONNECT]     : subUserDisconnected,
    [events.USER_JOINED]    : subUserJoinedChannel,
    [events.USER_LEFT]      : subUserLeftChannel,
};

function requestSync() {
    sub.subscribe(SYNC_CHANNEL);
    pubRequestSync();
}

function respondToSyncRequest() {
    if (cluster.isMaster) {
        const state = ChatStore.serializeStoreState();
        pubSyncChatStore(state);
    }
}

function subSyncChatStore(data) {
    if (cluster.isWorker) {
        sub.unsubscribe(SYNC_CHANNEL);
        ChatStore.unserializeStoreState(data);
    }
}

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

    if (cluster.isWorker) {
        subEvents[syncEvents.SYNC_EVENT] = subSyncChatStore;
    } else {
        sub.subscribe(SYNC_CHANNEL);
        subEvents[syncEvents.NEEDS_SYNC] = respondToSyncRequest;
    }
}

export { createRedisSub, requestSync };
