import bcrypt       from 'bcryptjs';

function generateHashSync(str) {
    if (!str) {
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(str, salt)

    return hash;
}

function validateString(str, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(str, hash, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    })
}

export default { generateHashSync, validateString };
