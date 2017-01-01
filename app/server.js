import express  from 'express';
import http     from 'http';
import cors     from 'cors';
import parser   from 'body-parser';

import channels                  from './routes/channels';
import auth                      from './routes/auth';

import { config }                from './config';
import { createSocketIO }        from './socketio';
import { createClusterServer }   from './cluster/create';
import { createRedisConnection } from './database/redis';
import { requestSync }           from './database/redis-sub';
import { log }                   from './utils';
import { logRequest }            from './middleware';

const app = express();

app.use(cors());
app.use(logRequest);
app.use(parser.json({limit: '50mb'}));

app.use('/channels', channels);
app.use('/auth', auth);

const { server, isMaster } = createClusterServer(app);

createRedisConnection()
.then(() => {
    if (!isMaster) {
        requestSync();
    }
});


if (!isMaster) {
    createSocketIO(server);
}
