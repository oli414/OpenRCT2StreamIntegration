import Action from "./Action.js";

const SUNNY = "0";
const PARTLY_CLOUDY = "1";
const CLOUDY = "2";
const RAIN = "3";
const HEAVY_RAIN = "4";
const STORM = "5";

class ForceWeather extends Action {
    constructor(actionManager) {
        super(actionManager);
        this.identifier = "FORCE_WEATHER";
    }

    trigger(params) {
        var newMessage = params.message;
        if(params.message.toLowerCase().includes("sun")) {
            newMessage = SUNNY;
        }else if(params.message.toLowerCase().includes("partly")) {
            newMessage = PARTLY_CLOUDY;
        }else if(params.message.toLowerCase().includes("cloud")) {
            newMessage = CLOUDY;
        }else if(params.message.toLowerCase().includes("heavy")) {//Let's do the heavy rain check first, as this also has the word rain in it too
            newMessage = HEAVY_RAIN;
        }else if(params.message.toLowerCase().includes("rain")) {
            newMessage = RAIN;
        }else if(params.message.toLowerCase().includes("storm") || params.message.toLowerCase().includes("thunder")) {
            newMessage = STORM;
        }
        this.actionManager.send({
            type: this.identifier,
            username: params.username,
            message: newMessage
        });
    }
}

export default ForceWeather;
