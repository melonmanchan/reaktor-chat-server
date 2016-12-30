import express from 'express';

import { signUserWithToken } from '../utils';
import { verifyUserPassword, createUser, getUserByName } from '../database/user';

const router = express.Router();

router.post('/register', (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;

    if (!name || !password) {
        return res.status(400).json({ error: 'Missing parameter!' });
    }

    if (name.length < 3 ) {
        return res.status(400).json({ error: `The name ${name} is too short. (min 3. characters)`});
    }

    if (password.length < 6 ) {
        return res.status(400).json({ error: `The password ${password} is too short. (min 6. characters)`});
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
        .then(rsults => {
            res.status(200).json({ token: results.token, expiresIn: results.expiresIn });
        })
        .catch(e => {
            res.status(500).json({ error: e.message });
        });
});


router.post('/login', (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password

    if (!name || !password) {
        return res.status(400).json({ error: 'Missing parameter!' });
    }

    getUserByName(name)
        .then(foundUser => {
            if (!foundUser) {
                return Promise.reject({ message: 'User not found!'});
            }

            return verifyUserPassword(foundUser.password, password);
        })
        .then(() => {
            return signUserWithToken({ name: name });
        })
        .then(results => {
            res.status(200).json({ token: results.token, expiresIn: results.expiresIn });
        })
        .catch(e => {
            res.status(500).json({ error: e.message });
        });
});

export default router;
