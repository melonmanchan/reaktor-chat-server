# Reaktor chat server

Backend of a simple, quick and scalable RESTful Socket.io/redis/express
application.

See frontend here: https://github.com/melonmanchan/reaktor-chat-client

## System architecture
The server has a single master node and X workers working in a clustered
manners. The amount of workers is configured by the environment variable
`WORKERS`. By default, it is the amount of processors on the machine minus one.
All outfacing HTTP requests and socket connections are then served by these
workers. Sticky sessions are implemented (request from same IP address) will
end up into the same worker. This is required by Socket.io's HTTP fallback
mechanism. If using strictly websockets, just Redis would be enough.

Each piece of the cluster has an in-memory data-store (see
`app/store/chatstore.js`) The application state such as the connected users and
what channels they're currently part of is held there. The master node of the
cluster is the 'Single Source of Truth', which has the final say in what the
application state looks like. Upon startup, a worker node requests the current
state from the master node. In this way, even if a worker crashes and has to be
restarted, it's state will still stay in sync with the rest of the cluster.
Each store also holds the sockets connected to that particular node, mapped to
the users. Whenever a state-manipulating event happens (user logs in, joins a
channel etc.), the worker the user socket is connected to fires an event, which
causes the rest of the cluster to update their state.

Further reading on clustering socket.io, which this application attempts to
expand upon: https://github.com/elad/node-cluster-socket.io

## Running in development
First off, install Yarn: https://yarnpkg.com/ Then, clone this repository and
install the required packages

```sh
    git clone https://github.com/melonmanchan/reaktor-chat-server
    cd reaktor-chat-server
    yarn
```

Then, you should install Redis. Redis is used to store chat messages and user
credentials, and exchange messages between workers and clusters.

https://redis.io/download

Afterwards, launch Redis on localhost:6379 and run `npm start` to start the
server. See the configuration section below for various tuning options. Just one
worker cluster is more than enough for running in development

```sh
    WORKERS=1 npm start
```

## Running in production
Docker, orchestrated by Docker Compose, is the recommended way of running this
application in production. Simply install those two:

https://docs.docker.com/engine/installation/

https://docs.docker.com/compose/

and change some of the default environment variables, such as the JWT token, in
the file chat.env. Afterwards, run:

```sh
    docker-compose up
```

In the root of this repository. This will pull the required images from docker
hub and start the application on port 8000.
