
class Action {
    constructor(actionManager) {
        this.actionManager = actionManager;
        this.identifier = "NONE";
    }

    trigger(params) {
        this.actionManager.send({
            type: this.identifier,
            username: params.username,
            message: params.message
        });
    }
}

export default Action;
