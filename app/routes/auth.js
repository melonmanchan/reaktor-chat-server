import express from 'express';
import { signUserWithToken } from '../utils';

const router = express.Router();

router.post('/login', (req, res, next) => {
    const name = req.body.name;

    if (name) {
        signUserWithToken({ name })
        .then(token => {
            return res.status(200).json({ token });
        })
        .catch( e => {
            return res.status(500).json({ error: e.message });
        });
    } else {
        return res.status(500).json({ error: 'Missing parameter!' });
    }
});

export default router;
