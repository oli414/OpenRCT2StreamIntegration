const NameRide = require("./actions/NameRide");
const SpawnPeep = require("./actions/SpawnPeep");

class ActionManager {
    constructor(app) {
        this.app = app;
        this.actions = {};

        this.registerAction(NameRide);
        this.registerAction(SpawnPeep);
    }

    registerAction(type) {
        let newAction = new type();
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
}

module.exports = ActionManager;