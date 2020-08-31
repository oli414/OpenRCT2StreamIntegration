const Action = require("./Action");

class ReplaceRideColor extends Action {
    constructor(actionManager) {
        super(actionManager);
        this.identifier = "REPLACE_RIDE_COLOR";
    }

    trigger(params) {
        this.actionManager.send({
            type: this.identifier,
            username: params.username,
            message: params.message
        });
    }
}

module.exports = ReplaceRideColor;