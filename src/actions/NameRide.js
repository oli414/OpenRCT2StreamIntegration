const Action = require("./Action");

class NameRide extends Action {
    constructor(actionManager) {
        super(actionManager);
        this.identifier = "NAME_RIDE";
    }

    trigger(params) {
        this.actionManager.send({
            type: this.identifier,
            username: params.username,
            message: params.message
        });
    }
}

module.exports = NameRide;