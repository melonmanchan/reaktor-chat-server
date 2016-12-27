import jwt    from 'jsonwebtoken'
import { config } from '../config';

function decodeJWT(token) {
    return new Promise(function (resolve, reject) {
       jwt.verify(token, config.jwt_secret, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
       });
    });
}

function signUserWithToken(user) {
    return new Promise(function (resolve, reject) {
        jwt.sign(user, config.jwt_secret, {
            expiresIn: '7 days'
        }, (err, token) => {
            if (err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })
}

export { decodeJWT, signUserWithToken }

