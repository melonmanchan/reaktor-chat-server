import Promise from 'bluebird'

import { ChatStore } from '../store';
import { client } from './redis';
import { generateHashSync, validateString } from '../utils/bcrypt';
import crypt from '../utils/bcrypt';


const PREFIX = 'user__';

const userModel = {
    name     : null,
    password : null,
};

function createUser(user) {
    return new Promise((resolve, reject) => {
        if (!user.name || !user.password) {
            reject('Username or password were missing!');
        }

        const hashed = crypt.generateHashSync(user.password);

        client.hmset(PREFIX + user.name,  { name: user.name, password: hashed });

        resolve(user);
    });
}

function getUserByName(name) {
    return client.hgetallAsync(PREFIX + name);
}

function verifyUserPassword(hash, password) {
    return crypt.validateString(hash, password);
}

export { userModel, verifyUserPassword, createUser, getUserByName };
