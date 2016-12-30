import express from 'express';

import { defaultChannels, getLatestMessages }  from '../database/channel';
import { resolveJWT }          from '../middleware';
import { getSocketByUsername, joinChannel } from '../socketio';

const router = express.Router();

router.get('/', resolveJWT, (req, res, next) => {
    return res.status(200).json({ channels: defaultChannels });
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
    });
});


export default router;
