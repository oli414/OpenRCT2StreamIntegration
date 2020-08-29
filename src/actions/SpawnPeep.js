const Action = require("./Action");

class SpawnPeep extends Action {
    constructor() {
        super();
        this.identifier = "SPAWN_PEEP";
    }

    trigger(params) {
        params.username;
        params.message;
        params.input;
    }
}

module.exports = SpawnPeep;