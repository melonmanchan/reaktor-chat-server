import { log, LOG_TYPES } from '../utils/log';

export default function logRequest (req, res, next) {
    log(`URL: ${req.originalUrl} method: ${req.method}`);
    return next();
}

