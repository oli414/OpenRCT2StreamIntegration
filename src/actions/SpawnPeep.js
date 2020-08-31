const Action = require("./Action");

class SpawnPeep extends Action {
    constructor(actionManager) {
        super(actionManager);
        this.identifier = "SPAWN_PEEP";
    }

    trigger(params) {
        this.actionManager.send({
            type: this.identifier,
            username: params.username,
            message: params.message
        });
    }
}

module.exports = SpawnPeep;