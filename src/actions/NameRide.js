const Action = require("./Action");

class NameRide extends Action {
    constructor() {
        super();
        this.identifier = "NAME_RIDE";
    }

    trigger(params) {
        params.username;
        params.message;
        params.input;
    }
}

module.exports = NameRide;