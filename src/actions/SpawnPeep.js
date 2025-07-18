import Action from "./Action.js";

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

export default SpawnPeep;
