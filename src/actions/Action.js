
class Action {
    constructor(actionManager) {
        this.actionManager = actionManager;
        this.identifier = "NONE";
    }

    trigger(params) {
        var newMessage = params.message;
        if(this.identifier === "FORCE_WEATHER") {
            if(params.message.toLowerCase().includes("sun")) {
                newMessage = "0";
            }else if(params.message.toLowerCase().includes("partly")) {
                newMessage = "1";
            }else if(params.message.toLowerCase().includes("cloud")) {
                newMessage = "2";
            }else if(params.message.toLowerCase().includes("heavy")) {
                newMessage = "4";
            }else if(params.message.toLowerCase().includes("rain")) {
                newMessage = "3";
            }else if(params.message.toLowerCase().includes("storm") || params.message.toLowerCase().includes("thunder")) {
                newMessage = "5";
            }
        }
        this.actionManager.send({
            type: this.identifier,
            username: params.username,
            message: newMessage
        });
    }
}

export default Action;
