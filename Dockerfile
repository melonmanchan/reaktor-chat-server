FROM node:6.9.2

# Install yarn
RUN apt-get update
RUN apt-get install -y curl apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

RUN mkdir /src
ADD . /src
WORKDIR /src

RUN yarn
RUN npm run build

EXPOSE 8000
CMD npm run serve
