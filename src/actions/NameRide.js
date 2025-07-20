import Action from "./Action.js";

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

export default NameRide;
