import Promise from 'bluebird';

import { ChatStore }  from '../store';
import { client } from './redis';

const defaultChannels = [
    {
        name: 'Channel 1',
        key:  'channel1'
    },
    {
        name: 'Channel 2',
        key:  'channel2'
    },
    {
        name: 'Channel 3',
        key:  'channel3'
    },
];

const PREFIX_CHANNEL = 'channel__';
const PREFIX_CHANNEL_MSG = 'channel_msg__';

function getPublicChannels () {
    return new Promise((resolve, reject) => {
        const channelsWithUser = defaultChannels.map((c) => {
            c.onlineCount = ChatStore.getUsersInChannel(c.key).length;
            return c;
        });

        resolve(channelsWithUser);
    })
}

const messageModel = {
    username: '',
    message: '',
    date: null,
};


function addMessageToChannel(channelKey, message) {
    return client.rpushAsync(PREFIX_CHANNEL_MSG + channelKey, JSON.stringify(message));
}

function getChannelMessagesByRange(channelKey, start = 0, end = -1) {
    return client.lrangeAsync(PREFIX_CHANNEL_MSG + channelKey, start, end);
}

function getLatestMessages(channelKey, messageAmount = 25) {
    return getChannelMessagesByRange(channelKey, -(messageAmount), -1);
}

export { addMessageToChannel, getChannelMessagesByRange, getLatestMessages, getPublicChannels };
