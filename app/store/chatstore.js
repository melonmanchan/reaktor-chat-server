const ChatStore = {
    activeUsers: [],

    getUserByName(username) {
        return this.activeUsers.find(user => { return user.username === username; });
    },

    removeUser(user) {
        const userToRemove = this.getUserByName(user.username);

        if (!userToRemove) {
            return false;
        }

        this.activeUsers.splice(this.activeUsers.indexOf(userToRemove), 1);
        return true;
    },

    addUser(user) {
        const existing = this.getUserByName(user.username);

        if (existing) {
            return false;
        }

        this.activeUsers.push(user);

        return true;
    },

    addChannelToUser(channelKey, user) {
        const userToAdd = this.getUserByName(user.username);

        if (!userToAdd) {
            return false;
        }

        const ind = this.activeUsers.indexOf(userToAdd);

        this.activeUsers[ind].channels.push(channelKey);

        return true;
    },

    removeChannelFromUser(channelKey, user) {
        const userToRemove = this.getUserByName(user.username);

        if (!userToRemove) {
            return false;
        }

        const userIndex = this.activeUsers.indexOf(userToRemove);
        const channelIndex = user.channels.indexOf(channelKey);

        if (channelIndex === -1) {
            return false;
        }

        this.activeUsers[ind].channels.splice(channelIndex, 1);

        return true;
    },

    getUsersInChannel(channelKey) {
        return this.activeUsers.filter(u => { return u.channels.includes(channelKey)});
    },
};

export default ChatStore;
