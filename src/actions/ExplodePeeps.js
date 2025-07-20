import Action from "./Action.js";

class ExplodePeeps extends Action {
    constructor(actionManager) {
        super(actionManager);
        this.identifier = "EXPLODE_PEEPS";
    }

    trigger(params) {
        this.actionManager.send({
            type: this.identifier,
            username: params.username,
            message: params.message
        });
    }
}

export default ExplodePeeps;
