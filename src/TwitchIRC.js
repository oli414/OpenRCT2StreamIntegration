const tmi = require('tmi.js');

class TwitchIRC {
    constructor(config, authToken, channelName, twitchCom) {
        const that = this;

        this.botName = config.twitch.botName;
        this.channelName = channelName;
        this.authToken = authToken;

        this.twitchCom = twitchCom;

        this.usersInChat = [];

        this.client = new tmi.client({
            connection: {
                reconnect: true
            },
            identity: {
                username: this.channelName,
                password: this.authToken
            },
            channels: [
                this.channelName
            ]
        });

        this.client.on('message', (target, context, msg, self) => {
            if (self) return;

            if (that.usersInChat.indexOf(context["display-name"]) == -1) {
                that.usersInChat.push(context["display-name"]);
                that.twitchCom.app.triggerManager.trigger("VIEWER_JOINS", {
                    message: "",
                    username: context["display-name"],
                    subscriber: false
                });
            }

            that.twitchCom.app.triggerManager.trigger("COMMAND", {
                message: msg,
                username: context["display-name"],
                subscriber: context.subscriber
            });
        });

        //*
        this.client.on("join", (channel, username, self) => {
            that.twitchCom.apiGetRequest("/helix/users?login=" + username).then((data) => {
                that.twitchCom.app.triggerManager.trigger("VIEWER_JOINS", {
                    message: "",
                    username: data.data[0].display_name,
                    subscriber: false
                });
            });
        });//*/

        this.client.on('connected', (addr, port) => {
            console.log("Connected to Twitch chat");
            this.twitchCom.app.addReadyFlag(2);
        });

        this.client.on('disconnected', (addr, port) => {
            console.log("Twitch chat disconnected");
            this.twitchCom.app.removeReadyFlag(2);
        });
    }

    connect() {
        this.client.connect().catch((err) => {
            console.error("Failed to connect to Twitch chat: " + err);
        });
    }
}

module.exports = TwitchIRC;