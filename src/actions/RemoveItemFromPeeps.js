import Action from "./Action.js";

const items_to_remove = [
    "balloon",
    "hat",
    "umbrella",
    "map"
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class RemoveItemFromPeeps extends Action {
    constructor(actionManager) {
        super(actionManager);
        this.identifier = "REMOVE_ITEM_FROM_PEEPS";
    }

    trigger(params) {
        var newMessage = params.message;
        if(params.message === undefined || params.message === "") {
            newMessage = items_to_remove[getRandomInt(items_to_remove.length)];
        }
        this.actionManager.send({
            type: this.identifier,
            username: params.username,
            message: newMessage
        });
    }
}

export default RemoveItemFromPeeps;
