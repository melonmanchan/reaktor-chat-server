# Reaktor chat server

Backend of a (Somewhat) simple, scalable Socket.io/redis/express application.

# Running (development)
First off, install Yarn: https://yarnpkg.com/ Then, clone this repository and
install the required packages

```sh
    git clone https://github.com/melonmanchan/reaktor-chat-server
    cd reaktor-chat-server
    yarn
```

Then, you should install Redis. Redis is used to store chat messages and user
credentials, and broker messages between workers and clusters.

https://redis.io/download

Afterwards, launch Redis on localhost:6379 and run `npm start` to start the
server. See the configuration section below for various tuning options.

# Running (production)
Docker, orchestrated by Docker Compose, is the recommended way of running this
application in production. Simply install those:

https://docs.docker.com/engine/installation/
https://docs.docker.com/compose/

and change some of the default environment variables, such as the JWT token, in
the file chat.env. Afterwards, run

```sh
    docker-compose up
```

In the root of this repository, and the server should be running at port 8000.
