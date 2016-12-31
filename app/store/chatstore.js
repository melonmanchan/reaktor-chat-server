import findKey from 'lodash.findKey';

const ChatStore = {
    _activeUsers: [],

    _connectedSockets : {},

    // Users
    getUserByName(username) {
        return this._activeUsers.find(user => { return user.username === username; });
    },

    getUserIndex(username) {
        return this._activeUsers.findIndex(user => { return user.username === username })
    },

    removeUser(user) {
        const index = this.getUserIndex(user.username);

        if (index === -1) {
            return false;
        }

        this._activeUsers.splice(index, 1);
        return true;
    },

    addUser(user) {
        const existing = this.getUserByName(user.username);

        if (existing) {
            return false;
        }

        this._activeUsers.push(user);

        return true;
    },

    addChannelToUser(channelKey, user) {
        const index = this.getUserIndex(user.username);

        if (index === -1) {
            return false;
        }

        this._activeUsers[index].channels.push(channelKey);

        return true;
    },

    removeChannelFromUser(channelKey, user) {
        const index = this.getUserIndex(user.username);

        if (index === -1) {
            return false;
        }

        const userToRemove = this._activeUsers[index];
        const channelIndex = userToRemove.channels.indexOf(channelKey);

        if (channelIndex === -1) {
            return false;
        }

        this._activeUsers[index].channels.splice(channelIndex, 1);

        return true;
    },

    getUsersInChannel(channelKey) {
        // Filter out channels they're part of first, since this
        // might be considered sensitive information!
        return this._activeUsers.reduce((arr, user) => {
            if (user.channels.includes(channelKey)) {
                arr.push({ username: user.username, status: 'online' });
            }

            return arr;
        }, []);
    },

    // Sockets
    addSocket(socket, username) {
        this._connectedSockets[username] = socket;
    },

    deleteSocketByName(username) {
        delete this._connectedSockets[username];
    },

    deleteSocket(socket) {
        const name = findKey(this._connectedSockets, socket)
        this.deleteSocketByName(name);
    },

    getUserBySocket(socket) {
        const name = findKey(this._connectedSockets, socket);

        if (!name) {
            return;
        }

        return this.getUserByName(name);
    },

    getSocketByUsername(username) {
        return this._connectedSockets[username];
    }
};

export default ChatStore;
