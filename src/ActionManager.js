const NameRide = require("./actions/NameRide");
const SpawnPeep = require("./actions/SpawnPeep");
const ReplaceRideColor = require("./actions/ReplaceRideColor");

const Net = require("net");
const port = 8081;

class ActionManager {
    constructor(app) {
        const that = this;
        this.app = app;
        this.actions = {};

        this.registerAction(NameRide);
        this.registerAction(SpawnPeep);
        this.registerAction(ReplaceRideColor);

        this.tcpServer = new Net.Server();
        this.activeSocket = null;

        this.tcpServer.on("connection", (socket) => {
            this.activeSocket = socket;
            console.log("TCP connection with OpenRCT2 plugin has been established");
            that.app.addReadyFlag(8);

            socket.on("end", () => {
                console.log("TCP connection with OpenRCT2 plugin has been closed");
                that.app.removeReadyFlag(8);
            });

            socket.on("error", (err) => {
                console.error("Error in TCP connection: " + err);
            });
        });
    }

    send(data) {
        if (this.activeSocket) {
            this.activeSocket.write(JSON.stringify(data));
        }
    }

    registerAction(type) {
        let newAction = new type(this);
        this.actions[newAction.identifier] = newAction;
    }

    trigger(actionIdentifier, params) {
        const action = this.actions[actionIdentifier];
        if (action) {
            action.trigger(params);
        }
        else {
            console.error("Failed to trigger action. Unknown action " + actionIdentifier + "");
        }
    }

    connect() {
        this.tcpServer.listen(port, () => {
            console.log("TCP server for communication with OpenRCT2 plugin has been started");
        });
    }

    buildParams(params) {
        let defaults = {
            username: "anonymous",
            subscriber: false,
            input: ""
        };

        if (params.username)
            defaults.username = params.username;
        if (params.subscriber)
            defaults.subscriber = params.subscriber;
        if (params.input)
            defaults.input = params.input;

        return defaults;
    }
}

module.exports = ActionManager;