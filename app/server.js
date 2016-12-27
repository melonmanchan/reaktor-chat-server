import express  from 'express';
import http     from 'http';
import cors     from 'cors';
import parser   from 'body-parser';

import { config }         from './config';
import { createSocketIO } from './socketio';
import { log }            from './utils';
import { logRequest }     from './middleware';
import channels           from './routes/channels';
import auth               from './routes/auth';

const app = express();

app.use(cors());
app.use(logRequest);
app.use(parser.json({limit: '50mb'}));

app.use('/channels', channels);
app.use('/auth', auth);

const server = http.Server(app);
createSocketIO(server);

server.listen(config.port, () => {
    log(`Chat server listening at port ${config.port}`);
});
