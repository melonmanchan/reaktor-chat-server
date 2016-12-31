import findKey from 'lodash.findKey';

const ChatStore = {
    _activeUsers: [],

    _connectedSockets : {},

    // Users
    getUserByName(username) {
        return this._activeUsers.find(user => { return user.username === username; });
    },

    removeUser(user) {
        const userToRemove = this.getUserByName(user.username);

        if (!userToRemove) {
            return false;
        }

        this._activeUsers.splice(this._activeUsers.indexOf(userToRemove), 1);
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
        const userToAdd = this.getUserByName(user.username);

        if (!userToAdd) {
            return false;
        }

        const ind = this._activeUsers.indexOf(userToAdd);

        this._activeUsers[ind].channels.push(channelKey);

        return true;
    },

    removeChannelFromUser(channelKey, user) {
        const userToRemove = this.getUserByName(user.username);

        if (!userToRemove) {
            return false;
        }

        const userIndex = this._activeUsers.indexOf(userToRemove);
        const channelIndex = user.channels.indexOf(channelKey);

        if (channelIndex === -1) {
            return false;
        }

        this._activeUsers[userIndex].channels.splice(channelIndex, 1);

        return true;
    },

    getUsersInChannel(channelKey) {
        // Filter out channels they're part of first, since this
        // might be considered as sensitive information!
        return this._activeUsers.reduce((arr, user) => {
            if (user.channels.includes(channelKey)) {
                arr.push({ username: user.username });
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
