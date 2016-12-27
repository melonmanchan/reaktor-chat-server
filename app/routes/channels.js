import express from 'express';

import channels                from '../channels';
import { resolveJWT }          from '../middleware';
import { getSocketByUsername, joinChannel } from '../socketio';

const router = express.Router();

router.get('/', resolveJWT, (req, res, next) => {
    return res.status(200).json({ channels });
});

router.post('/:key/join', resolveJWT, (req, res, next) => {
    const key = req.params.key

    // TODO: validate key
    if (!key) {
        return res.status(400).json({ error: 'Missing channel key' });
    }

    joinChannel(req.user.name, key);

    return res.status(200).json({ key });
});


export default router;
