import express from 'express';

import { defaultChannels, getLatestMessages, getChannelMessagesByRange }  from '../database/channel';
import { resolveJWT }          from '../middleware';
import { getSocketByUsername, joinChannel } from '../socketio';

const router = express.Router();

router.get('/', resolveJWT, (req, res, next) => {
    return res.status(200).json({ channels: defaultChannels });
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
            console.log(e)
            res.status(500).json({ error: e.message });
        })
});

router.post('/:key/join', resolveJWT, (req, res, next) => {
    const key = req.params.key

    // TODO: validate key
    if (!key) {
        return res.status(400).json({ error: 'Missing channel key' });
    }

    joinChannel(req.user.name, key);
    getLatestMessages(key)
        .then(messages => {
            res.status(200).json({ key, messages });
        })
        .catch(e => {
            console.log(e)
            res.status(500).json({ error: e.message });
        })
});


export default router;
