import express from 'express';

import { ChatStore }                                                       from '../store'
import { getLatestMessages, getPublicChannels, createChannel, getChannelMessagesByRange } from '../database/channel';
import { getSocketByUsername, joinChannel }                                from '../socketio';
import { resolveJWT }                                                      from '../middleware';
import { randomBase64 }                                                    from '../utils';

const router = express.Router();

router.get('/', resolveJWT, (req, res, next) => {
    getPublicChannels()
        .then((channels) => {
            res.status(200).json({ channels });
        });
});

router.post('/', resolveJWT, (req, res, next) => {
    const name = req.body.name;

    if (!name) {
        return res.status(400).json({ error: 'Missing channel name!' });
    }

    let newKey = null;

    randomBase64()
        .then((randomKey) => {
            newKey = randomKey;
            return createChannel(name, newKey);
        })
        .then(() => {
            res.status(201).json({ name: name, key: newKey, onlineUsers: 0});
        })
        .catch((e) => {
            res.status(500).json({ error: e.message });
        });
});

router.get('/:key/messages', resolveJWT, (req, res, next) => {
    const start = req.query.start;
    const end = req.query.end;
    const key = req.params.key;

    if (!key) {
        return res.status(400).json({ error: 'Missing channel key' });
    }

    // Negative signs since we want to fetch from end to start
    getChannelMessagesByRange(key, -end, -start)
        .then(messages => {
            res.status(200).json({ messages });
        })
        .catch(e => {
            res.status(500).json({ error: e.message });
        });
});

router.post('/:key/join', resolveJWT, (req, res, next) => {
    const key = req.params.key;

    // TODO: validate key
    if (!key) {
        return res.status(400).json({ error: 'Missing channel key' });
    }

    joinChannel(req.user.name, key);

    getLatestMessages(key)
        .then(messages => {
            const onlineUsers = ChatStore.getUsersInChannel(key);
            const currentUser = { username: req.user.name, status: 'online' };

            // Hack. Include self if not found
            if (onlineUsers.findIndex((u) => { return u.username === currentUser.username; }) === -1) {
                onlineUsers.push(currentUser) ;
            }

            res.status(200).json({ key, messages, onlineUsers });
        })
        .catch(e => {
            res.status(500).json({ error: e.message });
        });
});

export default router;
