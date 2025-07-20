import Action from "./Action.js";

const bad_things = [
    "EXPLODE_PEEPS",
    "REMOVE_MONEY",
    "NAUSEATE_PEEPS",
    "FILL_BLADDERS",
    "FORCE_WEATHER"
];

const good_things = [
    "GIVE_PEEPS_MONEY",
    "ADD_MONEY",
    "SPAWN_PEEPS",
    "HEAL_PEEPS",
    "MOW_GRASS",
    "FIX_VANDALISM",
    "REMOVE_LITTER",
    "FIX_RIDES",
    "EMPTY_BLADDERS",
    "FORCE_WEATHER"
];

const neutral_things = [
    "GIVE_PEEPS_PARK_MAPS",
    "GIVE_PEEPS_BALLOONS",
    "GIVE_PEEPS_UMBRELLAS",
    "SPAWN_DUCKS",
    "FORCE_WEATHER"
];

const all_things = [
    "EXPLODE_PEEPS",
    "REMOVE_MONEY",
    "NAUSEATE_PEEPS",
    "FILL_BLADDERS",
    "FORCE_WEATHER",
    "GIVE_PEEPS_MONEY",
    "ADD_MONEY",
    "SPAWN_PEEPS",
    "HEAL_PEEPS",
    "MOW_GRASS",
    "FIX_VANDALISM",
    "REMOVE_LITTER",
    "FIX_RIDES",
    "GIVE_PEEPS_PARK_MAPS",
    "GIVE_PEEPS_BALLOONS",
    "GIVE_PEEPS_UMBRELLAS",
    "SPAWN_DUCKS",
    "REMOVE_ALL_PEEPS",
    "EMPTY_BLADDERS"
];

const SUNNY = "0";
const STORM = "5";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class RandomAction extends Action {
    constructor(actionManager) {
        super(actionManager);
        this.identifier = "NONE";
    }

    trigger(params) {
        var newMessage = params.message;
        var idType = (this.identifier === "RANDOM_BAD_THING")?bad_things[getRandomInt(bad_things.length)]:((this.identifier === "RANDOM_GOOD_THING")?good_things[getRandomInt(good_things.length)]:all_things[getRandomInt(all_things.length)]);
        if(idType === "FORCE_WEATHER") {
            switch (this.identifier) {
                case "RANDOM_BAD_THING":
                    newMessage = STORM;
                    break;
                case "RANDOM_GOOD_THING":
                    newMessage = SUNNY;
                    break;
                case "RANDOM_THING":
                    newMessage = getRandomInt(6) + "";//Let's get a random weather effect
                    break;
            
                default:
                    newMessage = getRandomInt(6) + "";//Let's get a random weather effect
                    break;
            }
        }
        this.actionManager.send({
            type: idType,
            username: params.username,
            message: newMessage
        });
    }
}

export default RandomAction;
