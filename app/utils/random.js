import crypto  from 'crypto';
import Promise from 'bluebird';
import base64  from 'urlsafe-base64';

const promiseRand = Promise.promisify(crypto.randomBytes);

function randomBase64() {
    return promiseRand(32)
        .then((buffer) => {
            return Promise.resolve(base64.encode(buffer));
        });
}

export { randomBase64 };
