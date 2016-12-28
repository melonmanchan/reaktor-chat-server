import express from 'express';

import { signUserWithToken } from '../utils';
import { userModel, createUser, getUserByName } from '../database/user';

const router = express.Router();

router.post('/register', (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;

    if (!name || !password) {
        return res.status(400).json({ error: 'Missing parameter!' });
    }

    getUserByName(name)
        .then(existingUser => {
            if (existingUser) {
                return Promise.reject({message: "User with name already exists" });
            } else {
                return createUser({ name: name, password: password })
            }
        })
        .then(user => {
            delete user.password;
            return signUserWithToken(user);
        })
        .then(token => {
            res.status(201).json({ token });
        })
        .catch(e => {
            res.status(500).json({ error: e.message });
        });
});


router.post('/login', (req, res, next) => {
    const name = req.body.name;

    if (!name) {
        return res.status(400).json({ error: 'Missing parameter!' });
    }

    signUserWithToken({ name })
    .then(token => {
        return res.status(200).json({ token });
    })
    .catch( e => {
        return res.status(500).json({ error: e.message });
    });
});

export default router;
