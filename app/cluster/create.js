import cluster from 'cluster';
import net     from 'net';
import config  from '../config/config';
import { log } from '../utils';

const workers = [];

function spawn(index) {
    log(`Spawning worker ${index}`)
    workers[index] = cluster.fork()
    workers[index].on('exit', (code, sig) => {
        log(`Respawning worker ${index}`);
        spawn(index);
    });
}

function getWorkerIndex(ip, len) {
    let s = '';

    for (var i = 0, _len = ip.length; i < _len; i++) {
        if (!isNaN(ip[i])) {
            s += ip[i];
        }
    }

    return Number(s) % len;
}

function createClusterServer(app) {
    if (cluster.isMaster) {
        for (let i = 0; i < config.workers_count; i++) {
            spawn(i);
        }

        const server = net.createServer({ pauseOnConnect: true }, (connection) => {
            const worker = workers[getWorkerIndex(connection.remoteAddress, config.workers_count)];
            worker.send('sticky-session:connection', connection);
        }).listen(config.port, () => {
            log(`Master running at port ${config.port}`)
        });

        return { isMaster: true, server };
    } else {
        const server = app.listen(0, 'localhost');

        process.on('message', (message, connection) => {
            if (message !== 'sticky-session:connection') {
                return;
            }

            server.emit('connection', connection);

            connection.resume();
        });

        return { isMaster: false, server };
    }
}

export { createClusterServer }
