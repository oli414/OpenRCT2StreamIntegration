const DefaultAction = require("./actions/Action");
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
        this.registerAction(DefaultAction, "EXPLODE_PEEPS");
        this.registerAction(DefaultAction, "GIVE_PEEPS_PARK_MAPS");
        this.registerAction(DefaultAction, "GIVE_PEEPS_BALLOONS");
        this.registerAction(DefaultAction, "GIVE_PEEPS_UMBRELLAS");
        this.registerAction(DefaultAction, "GIVE_PEEPS_MONEY");
        this.registerAction(DefaultAction, "ADD_MONEY");
        this.registerAction(DefaultAction, "REMOVE_MONEY");
        this.registerAction(DefaultAction, "SPAWN_DUCKS");
        this.registerAction(DefaultAction, "SPAWN_PEEPS");
        this.registerAction(DefaultAction, "REMOVE_ALL_PEEPS");
        this.registerAction(DefaultAction, "NAUSEATE_PEEPS");
        this.registerAction(DefaultAction, "HEAL_PEEPS");
        this.registerAction(DefaultAction, "SET_STAFF_NAME");
        this.registerAction(DefaultAction, "FILL_BLADDERS");
        this.registerAction(DefaultAction, "EMPTY_BLADDERS");
        this.registerAction(DefaultAction, "MOW_GRASS");
        this.registerAction(DefaultAction, "FIX_VANDALISM");
        this.registerAction(DefaultAction, "REMOVE_LITTER");
        this.registerAction(DefaultAction, "FORCE_WEATHER");
        this.registerAction(DefaultAction, "SET_PARK_NAME");

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

    registerAction(type, identifier = null) {
        let newAction = new type(this);

        if (identifier == null) {
            identifier = newAction.identifier;
        }
        else {
            newAction.identifier = identifier;
        }
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