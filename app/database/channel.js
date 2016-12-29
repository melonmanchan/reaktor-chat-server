import { client } from './redis';

const PREFIX_CHANNEL = 'channel__';
const PREFIX_CHANNEL_MSG = 'channel_msg__';

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

export { addMessageToChannel, getChannelMessagesByRange };
