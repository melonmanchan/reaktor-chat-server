import Promise from 'bluebird';

import { ChatStore }  from '../store';
import { client }     from './redis';

const defaultChannels = [
    {
        name: 'General',
        key:  'general'
    },
    {
        name: 'Programming',
        key:  'programming'
    },
    {
        name: 'Random',
        key:  'random'
    },
];

const PREFIX_CHANNEL = 'channel__';
const PREFIX_CHANNEL_MSG = 'channel_msg__';

const PUBLIC = '_public';
const PRIVATE = '_private';

function getPublicChannels () {
    return new Promise((resolve, reject) => {
        client.lrangeAsync(PREFIX_CHANNEL + PUBLIC, 0, -1)
            .then((publicChannels) => {
                const asObjects = publicChannels.map((o) => { return JSON.parse(o); });

                const allPublicChannels = defaultChannels.concat(asObjects);

                const channelsWithUser = allPublicChannels.map((c) => {
                    c.onlineCount = ChatStore.getUsersInChannel(c.key).length;
                    return c;
                });

                resolve(channelsWithUser);
            })
            .catch((e) => {
                reject(e);
            });
    });
}

function createChannel(channelName, channelKey, isPublic = true) {
    const prefix = (isPublic ? PUBLIC : PRIVATE );

    return client.rpushAsync(PREFIX_CHANNEL + prefix, JSON.stringify({
        key: channelKey, name: channelName }));
}

function addMessageToChannel(channelKey, message) {
    return client.rpushAsync(PREFIX_CHANNEL_MSG + channelKey, JSON.stringify(message));
}

function getChannelMessagesByRange(channelKey, start = 0, end = -1) {
    return client.lrangeAsync(PREFIX_CHANNEL_MSG + channelKey, start, end);
}

function getLatestMessages(channelKey, messageAmount = 25) {
    return getChannelMessagesByRange(channelKey, -(messageAmount), -1);
}

export { addMessageToChannel, getChannelMessagesByRange, createChannel,
        getLatestMessages, getPublicChannels };
