import Action from "./Action.js";

class ReplaceRideColor extends Action {
    constructor(actionManager) {
        super(actionManager);
        this.identifier = "REPLACE_RIDE_COLOR";
    }

    trigger(params) {
        if (params.recolorableColor) {
            params.message = params.recolorableColor + " to " + params.message;
        }

        this.actionManager.send({
            type: this.identifier,
            username: params.username,
            message: params.message
        });
    }
}

export default ReplaceRideColor;
