import Promise from 'bluebird';
import jwt     from 'jsonwebtoken';

import { config } from '../config';

function decodeJWT(token) {
    return new Promise(function (resolve, reject) {
       jwt.verify(token, config.jwt_secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
       });
    });
}

function signUserWithToken(user) {
    return new Promise(function (resolve, reject) {
        // Token expires in one week
        const currentDate = Math.floor(Date.now() / 1000);
        const expiresIn = currentDate + 604800;

        jwt.sign(user, config.jwt_secret, {
            expiresIn: expiresIn,
        }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve({ token, expiresIn: expiresIn * 1000 });
            }
        });
    });
}

export { decodeJWT, signUserWithToken };
