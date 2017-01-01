import crypto  from 'crypto';
import Promise from 'bluebird';

function randomBase64() {
    return new Promise((reject, resolve) => {
        crypto.randomBytes(46, (err, buf) => {
            if (err) {
                reject(err);
            } else {
                resolve(buf.toString('base64'));
            }
        });
    });
}

export { randomBase64 };
