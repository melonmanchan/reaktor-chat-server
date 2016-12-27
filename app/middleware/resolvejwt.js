import { config}     from '../config';
import { decodeJWT } from '../utils';

export default function resolveJWT(req, res, next)  {
    let token = req.headers['authorization']

    if (!token) {
        res.status(400).json({ error: 'Token is missing' });
        return;
    }

    token = token.replace('Bearer: ', '');

    decodeJWT(token)
        .then(results => {
            req.user = results;
            next();
        })
        .catch( err => {
            res.err(400, GENERIC.TOKEN_MISSING, 'Token is missing!')
            res.end();
        });
};

